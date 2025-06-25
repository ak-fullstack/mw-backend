import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, DataSource, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerAddress } from 'src/customer/customer-address/entities/customer-address.entity';
import { State, StateGstTypeMap } from 'src/enum/states.enum';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { GstType } from 'src/enum/gst-types.enum';
import { OrderStatus, OrderStatusPriority } from 'src/enum/order-status.enum';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { StockStage } from 'src/enum/stock-stages.enum';
import { StockMovementsService } from 'src/inventory/stock-movements/stock-movements.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {

  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly stockMovementsService: StockMovementsService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
    private dataSource: DataSource
  ) { }

  async create(createOrderDto: CreateOrderDto, customerId: number): Promise<any> {

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });


    if (!customer) {

      throw new UnauthorizedException('Customer not found');
    }

    if (!customer.phoneNumber) {
      customer.phoneNumber = createOrderDto.shippingPhoneNumber;
      await this.customerRepository.save(customer);
    }

    const shippingAddress = await this.customerAddressRepository.findOne({
      where: { id: createOrderDto.shippingAddressId, customerId }
    });
    if (!shippingAddress) {
      throw new BadRequestException('Shipping address does not belong to the customer');
    }

    const billingAddress = await this.customerAddressRepository.findOne({
      where: { id: createOrderDto.billingAddressId, customerId }
    });
    if (!billingAddress) {
      throw new BadRequestException('Billing address does not belong to the customer');
    }

    if (createOrderDto.billingSameAsShipping) {
      if (createOrderDto.billingAddressId !== createOrderDto.shippingAddressId) {
        throw new BadRequestException('Billing and shipping address IDs must be same when billingSameAsShipping is true');
      }
    } else {
      if (createOrderDto.billingAddressId === createOrderDto.shippingAddressId) {
        throw new BadRequestException('Billing and shipping address IDs must be different when billingSameAsShipping is false');
      }
    }

    const order = new Order();
    order.customerId = customerId;
    order.billingName = customer.fullName;
    order.billingPhoneNumber = customer.phoneNumber;
    order.billingEmailId = customer.emailId;
    order.billingStreetAddress = billingAddress.streetAddress;
    order.billingCity = billingAddress.city;
    order.billingState = billingAddress.state;
    order.billingPincode = billingAddress.pincode;
    order.billingCountry = billingAddress.country || 'India';
    order.shippingName = createOrderDto.shippingName;
    order.shippingPhoneNumber = createOrderDto.shippingPhoneNumber;
    order.shippingEmailId = createOrderDto.shippingEmailId;
    order.shippingStreetAddress = shippingAddress.streetAddress;
    order.shippingCity = shippingAddress.city;
    order.shippingState = shippingAddress.state;
    order.shippingPincode = shippingAddress.pincode;
    order.shippingCountry = shippingAddress.country || 'India';

    const calculationResult = await this.calculateOrder(createOrderDto.items, shippingAddress.state);
    const { subTotal, totalAmount, totalTax, totalDiscount, orderItems } = calculationResult;
    order.subTotal = subTotal;
    order.totalTax = totalTax;
    order.totalAmount = totalAmount;
    order.totalDiscount = totalDiscount
    order.orderStatus = OrderStatus.PENDING;
    order.items = orderItems;

    const razorPayOrderDetails = await this.razorpayService.createOrder(order.totalAmount);

    console.log(razorPayOrderDetails);

    order.razorpayOrderId = razorPayOrderDetails.id;

    await this.dataSource.transaction(async manager => {
      const savedOrder = await manager.save(Order, order);
      for (const item of orderItems) {
        item.order = savedOrder;
        await manager.save(OrderItem, item);
      }
    });

    return { razorpayOrderId: razorPayOrderDetails.id, name: order.billingName, email: order.billingEmailId, contact: order.billingPhoneNumber }
  }

  private async calculateOrder(
    items: OrderItemDto[],
    shippingState: State
  ): Promise<{ orderItems: OrderItem[]; subTotal: number; totalTax: number; totalAmount: number; totalDiscount: number }> {
    return await this.dataSource.transaction(async (manager) => {
      const orderItems: OrderItem[] = [];
      let subTotal = 0;
      let totalTax = 0;
      let totalAmount = 0;
      let totalDiscount = 0;

      const gstType = StateGstTypeMap[shippingState];

      for (const item of items) {
        const stock = await manager.findOne(Stock, {
          where: { id: item.stockId },
          relations: ['productVariant'],
        });

        if (!stock) {
          throw new NotFoundException(`Stock with ID ${item.stockId} not found`);
        }

        if (!stock.approved || !stock.onSale) {
          throw new BadRequestException(`Stock ID ${item.stockId} is not available for sale`);
        }

        if (stock.available < item.quantity) {
          throw new BadRequestException(`Insufficient stock for stock ID ${item.stockId}`);
        }

        // Reserve stock within transaction
        stock.reserved += item.quantity;
        await manager.save(stock);

        const orderItem = new OrderItem();
        orderItem.stock = stock;
        orderItem.productVariant = stock.productVariant;
        orderItem.quantity = item.quantity;
        orderItem.sp = stock.sp;
        orderItem.mrp = stock.mrp;
        orderItem.cgst = stock.cgst;
        orderItem.sgst = stock.sgst;
        orderItem.igst = stock.igst;
        orderItem.discount = stock.discount;
        orderItem.ctc = stock.ctc;
        orderItem.gstType = gstType;
        orderItem.subTotal = stock.sp * item.quantity;
        orderItem.cgstAmount = gstType === GstType.CGST_SGST ? (orderItem.subTotal * stock.cgst) / 100 : 0;
        orderItem.sgstAmount = gstType === GstType.CGST_SGST ? (orderItem.subTotal * stock.sgst) / 100 : 0;
        orderItem.igstAmount = gstType === GstType.IGST ? (orderItem.subTotal * stock.igst) / 100 : 0;
        orderItem.taxAmount = orderItem.cgstAmount + orderItem.sgstAmount + orderItem.igstAmount;
        orderItem.totalAmount = orderItem.subTotal + orderItem.taxAmount;
        orderItem.discount = 0;

        subTotal += orderItem.subTotal;
        totalTax += orderItem.taxAmount;
        totalAmount += orderItem.totalAmount;
        totalDiscount = 0;

        orderItems.push(orderItem);
      }

      return {
        orderItems,
        subTotal,
        totalTax,
        totalAmount,
        totalDiscount,
      };
    });
  }

 async findAll(filters: {
  id?: string;
  razorpayOrderId?: string;
  orderStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}): Promise<{ total: number; page: number; limit: number; orders: any[] }> {
  try {
    const where: any = {};

    if (filters.id) {
      where.id = filters.id;
    }

    if (filters.razorpayOrderId) {
      where.razorpayOrderId = filters.razorpayOrderId;
    }

    if (filters.orderStatus) {
      const orderStatuses = filters.orderStatus.split(',').map(s => s.trim());
      if (orderStatuses.length > 0) {
        where.orderStatus = In(orderStatuses);
      }
    }

    if (filters.paymentStatus) {
      const paymentStatuses = filters.paymentStatus.split(',').map(s => s.trim());
      if (paymentStatuses.length > 0) {
        where.paymentStatus = In(paymentStatuses);
      }
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt = Between(start, end);
    } else if (filters.startDate) {
      where.createdAt = MoreThanOrEqual(new Date(filters.startDate));
    } else if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt = LessThanOrEqual(end);
    }

    const skip = (filters.page - 1) * filters.limit;

    const [orders, total]: [Order[], number] = await this.orderRepository.findAndCount({
      where,
      skip,
      take: filters.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      total,
      page: filters.page,
      limit: filters.limit,
      orders: orders.map(order => ({
        ...order,
        fullBillingAddress: order.fullBillingAddress,
        fullShippingAddress: order.fullShippingAddress,
      })),
    };
  } catch (error) {
    console.error('Error fetching orders with filters:', filters, '\nError:', error);
    throw new Error('Failed to fetch orders. Please try again later.');
  }
}


  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.productVariant',
        'items.productVariant.size',
        'items.productVariant.color',
        'items.productVariant.images',
        'items.productVariant.product',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findOrdersByOrderStatus(filters: {
    id?: string;
    razorpayOrderId?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
    orderStatus:OrderStatus,
    paymentStatus:PaymentStatus
  }): Promise<{ total: number; page: number; limit: number; orders: any[] }> {
    try {
      const where: any = {
        orderStatus: filters.orderStatus,
        paymentStatus: filters.paymentStatus,
      };

      console.log(filters.orderStatus,filters.paymentStatus);
      

      if (filters.id) {
        const idNum = parseInt(filters.id);
        if (!isNaN(idNum)) where.id = idNum;
      }

      if (filters.razorpayOrderId) {
        where.razorpayOrderId = filters.razorpayOrderId;
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt = Between(start, end);
      } else if (filters.startDate) {
        where.createdAt = MoreThanOrEqual(new Date(filters.startDate));
      } else if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt = LessThanOrEqual(end);
      }

      const skip = (filters.page - 1) * filters.limit;

      const [orders, total]: [Order[], number] = await this.orderRepository.findAndCount({
        where,
        skip,
        take: filters.limit,
        order: { createdAt: 'DESC' },
      });

      return {
        total,
        page: filters.page,
        limit: filters.limit,
        orders: orders.map(order => ({
          ...order,
          fullBillingAddress: order.fullBillingAddress,
          fullShippingAddress: order.fullShippingAddress,
        })),
      };

    } catch (err) {
      console.error('🔥 Error in findReceptionOrders():', err);
      throw new InternalServerErrorException(err.message || 'Internal error');
    }
  }

  async updateOrderStatus(updateOrderStausDto: UpdateOrderStatusDto,from,to,fromOrderStatus,toOrderStatus): Promise<any> {
    const { orderId, movedBy, remarks } = updateOrderStausDto;
    return await this.dataSource.transaction(async (manager) => {

      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.paymentStatus !== PaymentStatus.PAID) {
        throw new BadRequestException('Order is not paid');
      }

      if (order.orderStatus !== fromOrderStatus) {
        throw new BadRequestException('Order is not '+fromOrderStatus);
      }

      order.orderStatus = toOrderStatus;
      await manager.save(order);

      const orderItems = await manager.find(OrderItem, {
        where: { order: { id: orderId } },
      });      

      if (!orderItems || orderItems.length === 0) {
        throw new BadRequestException('No order items found');
      }

      
      const movements = orderItems.map((orderItem) => ({
        stockId: orderItem.stock.id,
        orderItemId: orderItem.id,
        orderId:orderItem.order.id,
        quantity: orderItem.quantity,
        from: from,
        to: to,
      }));
            console.log(movements);
      await this.stockMovementsService.createMovements(movements, manager);
      return {message: 'Order Successfully moved to '+toOrderStatus}
    });
  }

  async saveOrderDimensions(orderId: number, dims: { length: number; breadth: number; height: number; weight: number }) {
  await this.orderRepository.update(orderId, {
    packageLength: dims.length,
    packageBreadth: dims.breadth,
    packageHeight: dims.height,
    packageWeight: dims.weight,
  });
}

async getCustomerOrders(userId: number): Promise<any[]> {
  const afterPendingStatuses = Object.keys(OrderStatusPriority)
    .filter(
      (status) =>
        OrderStatusPriority[status as OrderStatus] > OrderStatusPriority[OrderStatus.PENDING]
    ) as OrderStatus[];

  const orders= await this.orderRepository.find({
    where: {
      customer: { id: userId },
      orderStatus: In(afterPendingStatuses),
    },
    relations: ['items.productVariant.product','items.productVariant.images'],
    order: { createdAt: 'DESC' },
  });

   return orders.map(order => {
  const items = order.items.map(item => ({
    productName: item.productVariant?.product?.name,
    quantityBought: item.quantity,
    itemTotal: item.totalAmount,
    imageUrl: item.productVariant?.images[0]?.imageUrl,
  }));

  const itemCount = items.reduce((sum, item) => sum + item.quantityBought, 0);

  return {
    orderId: order.id,
    orderStatus: order.orderStatus,
    totalAmount: order.totalAmount,
     shippingAddress: `${order.shippingName}, ${order.shippingStreetAddress}, ${order.shippingCity}, ${order.shippingState}, ${order.shippingCountry}, ${order.shippingPincode}, ${order.shippingPhoneNumber}`,
  billingAddress: `${order.billingName}, ${order.billingStreetAddress}, ${order.billingCity}, ${order.billingState}, ${order.billingCountry}, ${order.billingPincode}, ${order.billingPhoneNumber}`,
    createdAt: order.createdAt,
    itemCount,
    items,
  };
});
}

}
