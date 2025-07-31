import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, DataSource, EntityManager, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
import { ReturnsService } from '../returns/returns.service';
import { from } from 'form-data';
import { instanceToPlain } from 'class-transformer';
import { WalletService } from 'src/customer/wallet/wallet.service';
import { WalletTransaction, WalletTransactionReason } from 'src/customer/wallet-transaction/entities/wallet-transaction.entity';

@Injectable()
export class OrdersService {

  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly stockMovementsService: StockMovementsService,
    private readonly walletService: WalletService,

    private readonly returnService: ReturnsService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
    private dataSource: DataSource
  ) { }

  async create(createOrderDto: CreateOrderDto, customerId: number): Promise<any> {
    return await this.dataSource.transaction(async (manager) => {
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
      order.customer = customer;
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

      const calculationResult = await this.calculateOrder(createOrderDto.items, shippingAddress.state, manager);
      const { subTotal, totalAmount, totalTax, totalDiscount, orderItems, deliveryCharge, originalSubtotal, deliveryTaxAmount, totalItemTax } = calculationResult;
      order.subTotal = subTotal;
      order.totalTax = totalTax;
      order.totalAmount = totalAmount;
      order.totalDiscount = totalDiscount,
        order.originalSubtotal = originalSubtotal,
        order.totalDeliveryTax = deliveryTaxAmount,
        order.totalItemTax = totalItemTax,
        order.deliveryCharge = deliveryCharge,
        order.items = orderItems;

      const paymentSource = createOrderDto.paymentSource;
      let finalRazorpayAmount = 0;
      if (paymentSource === 'wallet') {
        const wallet = await this.walletService.getWalletByCustomerId(customer.id);
        if (!wallet || wallet.balance <= 0) {
          throw new BadRequestException('Wallet has no balance');
        }
        finalRazorpayAmount = Number((totalAmount - wallet.balance).toFixed(2));
        if (finalRazorpayAmount <= 0) {
          order.paymentSource = 'wallet';
          order.paymentStatus = PaymentStatus.PAID;
          order.orderStatus = OrderStatus.CONFIRMED;
          order.razorpayAmountPaid = 0;
          order.walletAmountUsed = totalAmount;
          order.paidAmount = totalAmount
        }
        else {
          order.paymentSource = 'wallet+razorpay';
          order.paymentStatus = PaymentStatus.PENDING;
          order.orderStatus = OrderStatus.PENDING;
          order.walletAmountUsed = wallet.balance;
        }

      } else if (paymentSource === 'razorpay') {
        order.paymentSource = 'razorpay';
        order.paymentStatus = PaymentStatus.PENDING;
        order.orderStatus = OrderStatus.PENDING;
        order.walletAmountUsed = 0;
        finalRazorpayAmount = totalAmount;

      } else {
        throw new BadRequestException('Invalid payment source');
      }




      let savedOrder;
      let razorPayOrderDetails;
      try {
        if (finalRazorpayAmount > 0) {


          razorPayOrderDetails = await this.razorpayService.createOrder(finalRazorpayAmount);
          order.razorpayOrderId = razorPayOrderDetails.id;

          savedOrder = await manager.save(Order, order);
        }
      } catch (error) {
        console.error('Error while saving order:', error);
        throw new InternalServerErrorException('Failed to save the order.'); // or rethrow original error
      }

      if (order.walletAmountUsed > 0 && order.paymentSource === 'wallet') {

        savedOrder = await manager.save(Order, order);
        await this.walletService.debit(customer.id, order.id, WalletTransactionReason.ORDER_PAYMENT, order.walletAmountUsed, manager);
      }



      for (const item of orderItems) {
        item.order = savedOrder;
      }
      const savedOrderItems = await manager.save(OrderItem, orderItems);

      const movements = savedOrderItems.map(orderItem => ({
        stockId: orderItem.stock.id,
        orderItemId: orderItem.id,
        orderId: savedOrder.id,
        quantity: orderItem.quantity,
        from: StockStage.AVAILABLE,
        to: StockStage.RESERVED,
      }));
      await this.stockMovementsService.createMovements(movements, manager);
      return { razorpayOrderId: savedOrder.razorpayOrderId, orderId: order.id, name: order.billingName, email: order.billingEmailId, contact: order.billingPhoneNumber }
    });
  }

  async calculateOrder(
    items: OrderItemDto[],
    shippingState: State,
    manager?: EntityManager
  ): Promise<{
    orderItems: OrderItem[]; subTotal: number; totalTax: number; totalAmount: number; totalDiscount: number; deliveryCharge: number, originalSubtotal: number,
    deliveryTaxAmount: number,
    totalItemTax: number,
  }> {
    const orderItems: OrderItem[] = [];
    let subTotal = 0;
    let totalTax = 0;
    let totalAmount = 0;
    let totalDiscount = 0;
    let originalSubtotal = 0;
    let totalItemTax = 0;

    const gstType = StateGstTypeMap[shippingState];



    for (const item of items) {
      const stock = manager
        ? await manager.findOne(Stock, {
          where: { id: item.stockId },
          relations: ['productVariant'],
        })
        : await this.stockRepository.findOne({
          where: { id: item.stockId },
          relations: ['productVariant'],
        });

      if (!stock) {
        throw new NotFoundException(`Stock with ID ${item.stockId} not found`);
      }

      if (!stock.approved || !stock.onSale) {
        throw new BadRequestException(`Stock ID ${item.stockId} is not available for sale`);
      }

      const available = await this.stockMovementsService.getNetQuantityForStockAndStage(item.stockId, StockStage.AVAILABLE);
      if (available < item.quantity) {
        throw new BadRequestException(`Insufficient stock for stock ID ${item.stockId}`);
      }

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
      orderItem.originalSubtotal = Number((stock.sp * item.quantity).toFixed(2))
      orderItem.discount = stock.applyDiscount ? stock.discount : 0;
      orderItem.subTotal = Number((orderItem.originalSubtotal - (orderItem.originalSubtotal * orderItem.discount) / 100).toFixed(2));
      orderItem.discountAmount = Number((orderItem.originalSubtotal * orderItem.discount / 100).toFixed(2));
      orderItem.itemCgstAmount = gstType === GstType.CGST_SGST ? Number(((orderItem.subTotal * stock.cgst) / 100).toFixed(2)) : 0;
      orderItem.itemSgstAmount = gstType === GstType.CGST_SGST ? Number(((orderItem.subTotal * stock.sgst) / 100).toFixed(2)) : 0;
      orderItem.itemIgstAmount = gstType === GstType.IGST ? Number((((orderItem.subTotal * stock.igst) / 100)).toFixed(2)) : 0;
      orderItem.itemTaxAmount = orderItem.itemCgstAmount + orderItem.itemSgstAmount + orderItem.itemIgstAmount;


      subTotal += orderItem.subTotal;
      originalSubtotal += orderItem.originalSubtotal;
      totalItemTax += orderItem.itemTaxAmount;
      totalAmount += orderItem.totalAmount;
      totalDiscount += orderItem.discountAmount;
      orderItems.push(orderItem);
    }

    const deliveryCharge = 50;
    let deliveryTaxAmount = 0;
    const totalItemValue = subTotal;

    if (deliveryCharge > 0 && totalItemValue > 0) {
      for (const orderItem of orderItems) {
        const share = orderItem.subTotal / totalItemValue;
        const deliveryPortion = Number((deliveryCharge * share).toFixed(2));

        orderItem.deliveryShare = share;
        orderItem.deliveryCharge = deliveryPortion;

        // Apply same GST rate as the item to its delivery share
        const deliveryCGST = orderItem.gstType === GstType.CGST_SGST ? (deliveryPortion * orderItem.cgst) / 100 : 0;
        const deliverySGST = orderItem.gstType === GstType.CGST_SGST ? (deliveryPortion * orderItem.sgst) / 100 : 0;
        const deliveryIGST = orderItem.gstType === GstType.IGST ? (deliveryPortion * orderItem.igst) / 100 : 0;
        const deliveryTax = Number(deliveryCGST.toFixed(2)) + Number(deliverySGST.toFixed(2)) + Number(deliveryIGST.toFixed(2));

        orderItem.deliveryCgstAmount = Number(deliveryCGST.toFixed(2));
        orderItem.deliverySgstAmount = Number(deliverySGST.toFixed(2));
        orderItem.deliveryIgstAmount = Number(deliveryIGST.toFixed(2));
        orderItem.deliveryTaxAmount = deliveryTax;
        orderItem.totalTaxAmount = Number((orderItem.itemTaxAmount + orderItem.deliveryTaxAmount).toFixed(2));
        orderItem.totalAmount = Number((orderItem.subTotal + orderItem.itemTaxAmount + orderItem.deliveryCharge + orderItem.deliveryTaxAmount).toFixed(2));
        deliveryTaxAmount += deliveryTax;
      }
    }


    totalTax = Number((totalItemTax + deliveryTaxAmount).toFixed(2));
    totalAmount = Number((subTotal + totalItemTax + deliveryCharge + deliveryTaxAmount).toFixed(2));

    return {
      orderItems,
      subTotal: Number(subTotal.toFixed(2)),
      totalTax,
      totalAmount,
      totalDiscount: Number(totalDiscount.toFixed(2)),
      deliveryCharge,
      originalSubtotal,
      deliveryTaxAmount,
      totalItemTax: Number(totalItemTax.toFixed(2)),


    };
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
        relations: ['items.productVariant.product', 'items.productVariant.images', 'items.productVariant.size', 'items.productVariant.color'],
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


  async orderReport(filters: {
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    try {
      const where: any = {};





      if (filters.paymentStatus) {
        const paymentStatuses = filters.paymentStatus.split(',').map(s => s.trim());
        if (paymentStatuses.length > 0) {
          where.paymentStatus = In(paymentStatuses);
        }
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(`${filters.startDate}T00:00:00.000Z`)
        const end = new Date(`${filters.endDate}T23:59:59.999Z`);

        where.createdAt = Between(start, end);
      } else if (filters.startDate) {
        const start = new Date(`${filters.startDate}T00:00:00.000Z`)

        where.createdAt = MoreThanOrEqual(start);
      } else if (filters.endDate) {
        const end = new Date(`${filters.endDate}T23:59:59.999Z`);
        where.createdAt = LessThanOrEqual(end);
      }


      const [orders, total]: [Order[], number] = await this.orderRepository.findAndCount({
        where,
        order: { createdAt: 'ASC' },
        relations: ['items.productVariant.product', 'items.productVariant.images', 'items.productVariant.size', 'items.productVariant.color'],
      });

      const transformedOrders = instanceToPlain(orders);


      const returns = await this.returnService.getReturnsWithWalletRefundItemsInRange(filters);
      const transformedReturns = instanceToPlain(returns);

      const orderSubtotalSum = orders.reduce((sum, order) => sum + (order.subTotal || 0), 0);
      const orderDeliveryChargeSum = orders.reduce((sum, order) => sum + (order.deliveryCharge || 0), 0);
      const orderTaxSum = orders.reduce((sum, order) => sum + (order.totalTax || 0), 0);
      const orderWalletSum = orders.reduce((sum, order) => sum + (order.walletAmountUsed || 0), 0);
      const orderRazorpaySum = orders.reduce((sum, order) =>
        Number((sum + (order.razorpayAmountPaid || 0)).toFixed(2)), 0);
      const orderTotalSum = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const returnSubtotalSum = Number(transformedReturns.reduce((sum, ret) =>
        sum + ret.items.reduce((itemSum, item) => itemSum + (item.subTotal || 0), 0), 0).toFixed(2));

      const returnDeliveryChargeSum = Number(transformedReturns.reduce((sum, ret) =>
        sum + ret.items.reduce((itemSum, item) => itemSum + (item.deliveryCharge || 0), 0), 0).toFixed(2));

      const returnTaxSum = Number(transformedReturns.reduce((sum, ret) =>
        sum + ret.items.reduce((itemSum, item) =>
          itemSum
          + (item.itemCgstAmount || 0)
          + (item.itemSgstAmount || 0)
          + (item.itemIgstAmount || 0)
          + (item.deliveryCgstAmount || 0)
          + (item.deliverySgstAmount || 0)
          + (item.deliveryIgstAmount || 0), 0), 0).toFixed(2));

      const returnTotalSum = Number(transformedReturns.reduce((sum, ret) =>
        sum + ret.items.reduce((itemSum, item) => itemSum + (item.totalAmount || 0), 0), 0).toFixed(2));


      return {
        totalOrders: total,
        totalReturns: returns.length,

        orderSubtotalSum,
        orderDeliveryChargeSum,
        orderTaxSum,
        orderWalletSum,
        orderRazorpaySum,
        orderTotalSum,

        returnSubtotalSum,
        returnDeliveryChargeSum,
        returnTaxSum,
        returnTotalSum,

        netSubtotalSum: Number((orderSubtotalSum - returnSubtotalSum).toFixed(2)),
        netDeliveryChargeSum: Number((orderDeliveryChargeSum - returnDeliveryChargeSum).toFixed(2)),
        netTaxSum: Number((orderTaxSum - returnTaxSum).toFixed(2)),
        netTotalSum: Number((orderTotalSum - returnTotalSum).toFixed(2)),

        orders: transformedOrders.map(order => ({
          id: order.id,
          orderStatus: order.orderStatus,
          subTotal: order.subTotal,
          deliveryCharge: order.deliveryCharge,
          totalTax: order.totalTax,
          totalAmount: order.totalAmount,
          walletAmountUsed: order.walletAmountUsed,
          razorpayAmountPaid: order.razorpayAmountPaid,
          fullBillingAddress: order.fullBillingAddress,
          fullShippingAddress: order.fullShippingAddress,
          items: order.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            productName: item.productVariant?.product?.name,
            originalSubtotal: item.originalSubtotal,
            discountAmount: item.discountAmount,
            subTotal: item.subTotal,
            itemCgstAmount: item.itemCgstAmount,
            itemSgstAmount: item.itemSgstAmount,
            itemIgstAmount: item.itemIgstAmount,
            deliveryCharge: item.deliveryCharge,
            deliveryCgstAmount: item.deliveryCgstAmount,
            deliverySgstAmount: item.deliverySgstAmount,
            deliveryIgstAmount: item.deliveryIgstAmount,
            totalAmount: item.totalAmount,
          })),
        })),
        returns: transformedReturns.map(ret => ({
          id: ret.id,
          returnStatus: ret.returnStatus,
          createdAt: ret.createdAt,
          processedAt: ret.processedDate,
          items: ret.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            productName: item.productVariant?.product?.name,
            originalSubtotal: item.originalSubtotal,
            discountAmount: item.discountAmount,
            subTotal: item.subTotal,
            itemCgstAmount: item.itemCgstAmount,
            itemSgstAmount: item.itemSgstAmount,
            itemIgstAmount: item.itemIgstAmount,
            deliveryCharge: item.deliveryCharge,
            deliveryCgstAmount: item.deliveryCgstAmount,
            deliverySgstAmount: item.deliverySgstAmount,
            deliveryIgstAmount: item.deliveryIgstAmount,
            totalAmount: item.totalAmount,
          })),
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
    orderStatus: OrderStatus,
    paymentStatus: PaymentStatus
  }): Promise<{ total: number; page: number; limit: number; orders: any[] }> {
    try {
      const where: any = {
        orderStatus: filters.orderStatus,
        paymentStatus: filters.paymentStatus,
      };


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

  async updateOrderStatus(updateOrderStausDto: UpdateOrderStatusDto, from, to, fromOrderStatus, toOrderStatus): Promise<any> {
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
        throw new BadRequestException('Order is not ' + fromOrderStatus);
      }

      order.orderStatus = toOrderStatus;
      if (toOrderStatus === OrderStatus.DELIVERED) {
        order.deliveredAt = new Date()
      }
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
        orderId: orderItem.order.id,
        quantity: orderItem.quantity,
        from: from,
        to: to,
      }));
      await this.stockMovementsService.createMovements(movements, manager);
      return { message: 'Order Successfully moved to ' + toOrderStatus }
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

  async getCustomerOrders(userId: any): Promise<any[]> {
    const afterPendingStatuses = Object.keys(OrderStatusPriority)
      .filter(
        (status) =>
          OrderStatusPriority[status as OrderStatus] > OrderStatusPriority[OrderStatus.PENDING]
      ) as OrderStatus[];

    const orders = await this.orderRepository.find({
      where: {
        customer: { id: userId },
        orderStatus: In(afterPendingStatuses),
      },
      relations: ['items.productVariant.product', 'items.productVariant.images'],
      order: { createdAt: 'DESC' },
    });


    return orders.map(order => {
      const items = order.items.map(item => ({
        productName: item.productVariant?.product?.name,
        quantity: item.quantity,
        itemTotal: item.totalAmount,
        imageUrl: item.productVariant?.images[0]?.imageUrl,
        orderItemId: item.id
      }));

      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const isDelivered = order.orderStatus === OrderStatus.DELIVERED;
      const daysSinceOrder = (new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const returnAvailable = isDelivered && daysSinceOrder <= 10;

      return {
        orderId: order.id,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
        shippingAddress: `${order.shippingName}, ${order.shippingStreetAddress}, ${order.shippingCity}, ${order.shippingState}, ${order.shippingCountry}, ${order.shippingPincode}, ${order.shippingPhoneNumber}`,
        billingAddress: `${order.billingName}, ${order.billingStreetAddress}, ${order.billingCity}, ${order.billingState}, ${order.billingCountry}, ${order.billingPincode}, ${order.billingPhoneNumber}`,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        deliveryCharge: order.deliveryCharge,
        totalTax: order.totalTax,
        subTotal: order.subTotal,
        itemCount,
        items,
        returnAvailable
      };
    });
  }

  async findByIdWithUser(orderId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: Number(orderId) }, // 👈 convert to number
      relations: ['customer'],
    });
  }

}
