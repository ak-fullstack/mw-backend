import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { Between, DataSource, EntityManager, In, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { OrderStatus } from 'src/enum/order-status.enum';
import { ReturnItem } from '../return-items/entities/return-item.entity';
import { Return } from './entities/return.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnStatus } from 'src/enum/return-status.enum';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { StockMovementsService } from 'src/inventory/stock-movements/stock-movements.service';
import { ReturnItemStatus } from 'src/enum/return-items-status.enum';
import { ReturnItemCondition } from 'src/enum/return-item-condition.enum';
import { StockStage } from 'src/enum/stock-stages.enum';
import { ApproveReturnDto } from './dto/approve-return.dto';
import { GstType } from 'src/enum/gst-types.enum';
import { ReturnResolutionMethod } from 'src/enum/resolution-method.enum';
import { WalletService } from 'src/customer/wallet/wallet.service';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { ReturnImage } from './return-images/entities/return-image.entity';
import { OrderSettingsService } from 'src/settings/order-settings/order-settings.service';

@Injectable()
export class ReturnsService {


  constructor(private dataSource: DataSource,
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,
    private stockMovementsService: StockMovementsService,
    private readonly walletService: WalletService, // Assuming you have a WalletService to handle wallet operations
    private readonly orderSettingService: OrderSettingsService
  ) {

  }

  // async onModuleInit() {
  //   await this.dataSource.transaction(async manager => {
  //     const order = await manager.findOne(Order, {
  //       where: { id: 40 },
  //       relations: ['items', 'items.stock'],
  //     });

  //     if (!order) {
  //       throw new NotFoundException('Order not found');
  //     }

  //     const movements = order.items.map(item => ({
  //       stockId: item.stock.id,
  //       orderItemId: item.id,
  //       orderId: order.id,
  //       quantity: item.quantity,
  //       from: StockStage.AVAILABLE,
  //       to: StockStage.RESERVED,
  //     }));

  //     await this.stockMovementsService.createMovements(movements, manager);
  //   });
  // }

  async createReturn(createReturnDto: CreateReturnDto, customerId: number) {
    return this.dataSource.transaction(async manager => {
      const order = await manager.findOne(Order, {
        where: {
          id: createReturnDto.orderId,
          customer: { id: customerId },
        },
        relations: ['customer', 'returns', 'items'],
      });

      if (!order) {
        throw new BadRequestException('Order not found or does not belong to the customer');
      }

      if (order.orderStatus !== OrderStatus.DELIVERED) {
        throw new BadRequestException('Return can only be created for delivered orders');
      }


      if (order.returns && order.returns.length !== 0) {
        throw new BadRequestException('A return request already exists for this order');
      }


      const settings = await this.orderSettingService.getSettings();

      const deliveryDate = new Date(order.deliveredAt);
      const today = new Date();
      const diffInDays = (today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
      const returnDays = settings.return_days ?? 10;
      if (diffInDays > returnDays) {
        throw new BadRequestException(`Return request is allowed only within ${returnDays} days of delivery`);
      }

      const orderItems = order.items;

      const orderItemMap = new Map<number, OrderItem>();

      for (const incomingItem of createReturnDto.items) {
        const { orderItemId } = incomingItem;

        if (orderItemMap.has(orderItemId)) {
          throw new BadRequestException(
            `Duplicate orderItemId found: ${orderItemId}. Each item must appear only once.`
          );
        }

        const fullItem = orderItems.find(item => item.id === orderItemId);
        if (!fullItem) {
          throw new BadRequestException(
            `OrderItem ID ${orderItemId} does not belong to order ${createReturnDto.orderId}`
          );
        }

        orderItemMap.set(orderItemId, fullItem);

        if (incomingItem.quantity > fullItem.quantity) {
          throw new BadRequestException(
            `Return quantity for item ${orderItemId} cannot be more than ordered quantity (${fullItem.quantity})`
          );
        }
      }


      order.hasReturn = true;
      await manager.save(Order, order)
      const returnRequest = manager.create(Return, {
        order,
        reason: createReturnDto.reason,
        status: 'PENDING',
      });

      const savedReturn = await manager.save(Return, returnRequest);

      try {

        const returnItemsToSave: ReturnItem[] = [];

        for (const incomingItem of createReturnDto.items) {
          const fullItem = orderItemMap.get(incomingItem.orderItemId);

          if (!fullItem) {
            throw new BadRequestException(
              `OrderItem ID ${incomingItem.orderItemId} not found during calculation`
            );
          }
          const calculatedData = await this.calculateItemAmount(fullItem, incomingItem.quantity);

          const returnItem = manager.create(ReturnItem, {
            returnRequest: { id: savedReturn.id },
            orderItem: { id: incomingItem.orderItemId },
            quantity: incomingItem.quantity,
            reason: incomingItem.reason,
            subTotal: calculatedData.subTotal,
            originalSubtotal: calculatedData.originalSubTotal,
            itemCgstAmount: calculatedData.itemCgstAmount,
            itemSgstAmount: calculatedData.itemSgstAmount,
            itemIgstAmount: calculatedData.itemIgstAmount,
            deliveryShare: calculatedData.deliveryShare,
            deliveryCharge: calculatedData.deliveryCharge,
            discountAmount: calculatedData.discountAmount,
            deliveryCgstAmount: calculatedData.deliveryCgstAmount,
            deliverySgstAmount: calculatedData.deliverySgstAmount,
            deliveryIgstAmount: calculatedData.deliveryIgstAmount,
            totalItemTax: calculatedData.totalItemTax,
            totalDeliveryTax: calculatedData.totalDeliveryTax,
            totalTaxAmount: calculatedData.totalTaxAmount,
            totalAmount: calculatedData.totalAmount,
            status: ReturnItemStatus.RETURN_REQUESTED,
          });
          returnItemsToSave.push(returnItem);

        }
        await manager.save(ReturnItem, returnItemsToSave);

      } catch (error) {
        console.error('Error while saving return items:', error);
        throw new InternalServerErrorException('Failed to save return items. Please try again.');
      }


      if (createReturnDto.images && createReturnDto.images.length > 0) {
        const returnImages = createReturnDto.images.map((imageUrl) =>
          manager.create(ReturnImage, {
            imageUrl,
            return: savedReturn,
          }),
        );

        await manager.save(ReturnImage, returnImages);
      }


      return { message: 'Return request Successfully created' }
    });


  }

  async getReturnRequests(): Promise<any> {
    return this.returnRepository.find({
      where: {
        returnStatus: ReturnStatus.RETURN_REQUESTED,
        items: {
          status: Not(ReturnItemStatus.SPLIT),
        },
      },
      relations: {
        items: {
          orderItem: {
            productVariant: {
              product: true,
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getAllReturns(status?: ReturnStatus) {
    const where: any = {};
    if (status) where.returnStatus = status;
    console.log(status);


    const returnRequests = await this.returnRepository.find({
      where,
      relations: [
        'items.orderItem.productVariant.product',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return returnRequests;
  }




  // async getReturnRequests(): Promise<any> {
  //   return this.returnRepository
  //     .createQueryBuilder('return')
  //     .leftJoinAndSelect('return.items', 'item', 'item.status != :splitStatus', {
  //       splitStatus: ReturnItemStatus.SPLIT,
  //     })
  //     .leftJoinAndSelect('item.orderItem', 'orderItem')
  //     .leftJoinAndSelect('orderItem.productVariant', 'productVariant')
  //     .leftJoinAndSelect('productVariant.product', 'product')
  //     .where('return.returnStatus != :waitingApprovalStatus', {
  //       waitingApprovalStatus: ReturnStatus.WAITING_APPROVAL,
  //     })
  //     .orderBy('return.createdAt', 'DESC')
  //     .getMany();
  // }

  async getWaitingApprovalReturns(): Promise<any> {
    return this.returnRepository
      .createQueryBuilder('return')
      .leftJoinAndSelect('return.items', 'item', 'item.status != :splitStatus', {
        splitStatus: ReturnItemStatus.SPLIT,
      })
      .leftJoinAndSelect('item.orderItem', 'orderItem')
      .leftJoinAndSelect('orderItem.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .where('return.returnStatus = :waitingApprovalStatus', {
        waitingApprovalStatus: ReturnStatus.WAITING_APPROVAL,
      })
      .orderBy('return.createdAt', 'DESC')
      .getMany();
  }


  async getReturnById(id: number): Promise<any> {
    const result = await this.returnRepository.findOne({
      where: { id },
      relations: [
        'images',
        'items.orderItem.productVariant.product',
        'items.orderItem.productVariant.images',
        'items.orderItem.productVariant.size',
        'items.orderItem.productVariant.color',
      ],
    });

    if (!result) return null;

    // Filter out items with status SPLIT
    result.items = result.items.filter(item => item.status !== ReturnItemStatus.SPLIT);

    return result;
  }

  async updateReturnStatus(updateReturnStausDto: UpdateReturnStatusDto, from, to, fromReturnStatus, toReturnStatus, returnItemStatus): Promise<any> {
    const { returnId, movedBy, remarks } = updateReturnStausDto;
    return await this.dataSource.transaction(async (manager) => {

      const orderReturn = await this.returnRepository.findOne({
        where: { id: returnId },
      });

      if (!orderReturn) {
        throw new NotFoundException('Return not found');
      }

      // if (order.paymentStatus !== PaymentStatus.PAID) {
      //   throw new BadRequestException('Order is not paid');
      // }

      if (orderReturn.returnStatus !== fromReturnStatus) {
        throw new BadRequestException('Return is not ' + fromReturnStatus);
      }

      orderReturn.returnStatus = toReturnStatus;
      // if (toReturnStatus === OrderStatus.DELIVERED) {
      //   orderReturn.deliveredAt = new Date()
      // }

      await manager.save(orderReturn);

      const returnItems = await manager.find(ReturnItem, {
        where: { returnRequest: { id: returnId } },
        relations: ['orderItem'],
      });



      if (!returnItems || returnItems.length === 0) {
        throw new BadRequestException('No return items found');
      }

      for (const item of returnItems) {
        item.status = returnItemStatus; // replace with your actual status value
      }
      console.log(returnItems);

      try {
        await manager.save(ReturnItem, returnItems);
      } catch (error) {
        console.error('Error saving return items:', error);
        throw new InternalServerErrorException('Failed to save return items');
      } console.log('asdad');

      const movements = returnItems.map((returnItem) => ({
        stockId: returnItem.orderItem.stock.id,
        orderItemId: returnItem.orderItem.id,
        orderId: returnItem.orderItem.order.id,
        quantity: returnItem.quantity,
        from: from,
        to: to,
      }));
      await this.stockMovementsService.createMovements(movements, manager);
      return { message: 'Return Successfully moved to ' + toReturnStatus }
    });
  }


  async verifyAndMoveItems(payload: {
    returnId: number;
    items: {
      stockId: number;
      returnItemId: number;
      quantity: number;
      itemCondition: ReturnItemCondition;
      orderItemId: number,
    }[];
  }): Promise<any> {
    const { returnId, items: incomingItems } = payload;

    return await this.dataSource.transaction(async (manager) => {
      // Step 1: Get original return items
      const returnRequest = await manager.findOne(Return, {
        where: { id: returnId },
        relations: ['items', 'items.orderItem'],
      });

      if (!returnRequest) {
        throw new NotFoundException(`ReturnRequest with ID ${returnId} not found`);
      }

      const originReturnItems = returnRequest.items;

      if (returnRequest.items.length === 0) {
        throw new BadRequestException(`No return items found for returnId ${returnId}`);
      }

      let itemQuantityMapping = {};

      for (const incomingItem of incomingItems) {
        let exist = false;
        itemQuantityMapping[incomingItem.returnItemId] =
          (itemQuantityMapping[incomingItem.returnItemId] || 0) + incomingItem.quantity;
        for (const originalItem of originReturnItems) {
          if (incomingItem.returnItemId === originalItem.id) {
            exist = true;
            if (incomingItem.quantity !== originalItem.quantity) {
              originalItem.status = ReturnItemStatus.SPLIT;
              const calculatedData = await this.calculateItemAmount(originalItem.orderItem, incomingItem.quantity);
              const newItem = manager.create(ReturnItem, {
                returnRequest: returnRequest,
                orderItem: originalItem.orderItem,
                quantity: incomingItem.quantity,
                itemCondition: incomingItem.itemCondition,
                status: ReturnItemStatus.WAITING_APPROVAL,
                subTotal: calculatedData.subTotal,
                originalSubtotal: calculatedData.originalSubTotal,
                itemCgstAmount: calculatedData.itemCgstAmount,
                itemSgstAmount: calculatedData.itemSgstAmount,
                itemIgstAmount: calculatedData.itemIgstAmount,
                deliveryShare: calculatedData.deliveryShare,
                deliveryCharge: calculatedData.deliveryCharge,
                deliveryCgstAmount: calculatedData.deliveryCgstAmount,
                deliverySgstAmount: calculatedData.deliverySgstAmount,
                deliveryIgstAmount: calculatedData.deliveryIgstAmount,
                totalItemTax: calculatedData.totalItemTax,
                totalDeliveryTax: calculatedData.totalDeliveryTax,
                totalTaxAmount: calculatedData.totalTaxAmount,
                totalAmount: calculatedData.totalAmount,
                discountAmount: calculatedData.discountAmount,
              });
              console.log(newItem);
              
              returnRequest.items.push(newItem);
            }
            else {
              originalItem.status = ReturnItemStatus.WAITING_APPROVAL;
              originalItem.itemCondition=incomingItem.itemCondition
            }

          }
        }
        if (!exist) {
          throw new BadRequestException(`Return item id ${incomingItem.returnItemId} is not part of the original return`)
        }
      }

      for (const originalItem of originReturnItems) {
        if (originalItem.id) {
          const totalIncomingQuantity = itemQuantityMapping[originalItem.id] || 0;
          if (totalIncomingQuantity !== originalItem.quantity) {
            throw new BadRequestException(
              `Total quantity for return item id ${originalItem.id} is ${totalIncomingQuantity}, but expected ${originalItem.quantity}`
            );
          }
        }
      }



      returnRequest.returnStatus = ReturnStatus.WAITING_APPROVAL;

      await manager.save(returnRequest);

      try {
        await manager.save(ReturnItem, originReturnItems);
      } catch (error) {
        console.error('Error saving return items:', error);
        throw new InternalServerErrorException('Failed to save return items');
      }
      const returnItems = await manager.find(ReturnItem, {
        where: {
          returnRequest: { id: returnId },
          status: Not(ReturnItemStatus.SPLIT),
        },
        relations: ['orderItem', 'orderItem.stock', 'orderItem.order'],
      });



      const movements = returnItems.map((item) => ({
        stockId: item.orderItem.stock.id,
        orderItemId: item.orderItem.id,
        orderId: item.orderItem.order.id,
        quantity: item.quantity,
        from: StockStage.RETURNED,
        to:item.itemCondition === ReturnItemCondition.GOOD
            ? StockStage.AVAILABLE
            : StockStage.DAMAGED,
      }));

      await this.stockMovementsService.createMovements(movements, manager);
      return { message: 'Return items verified and sent for approval', returnId };


    });
  }

  async processReturn(payload: ApproveReturnDto): Promise<any> {

    return await this.dataSource.transaction(async manager => {
      const { returnId, items: incomingItems } = payload;
      const returnRequest = await manager.findOne(Return, {
        where: { id: returnId },
        relations: ['items.orderItem.stock', 'order.customer.wallet'],
      });

      if (!returnRequest) {
        throw new NotFoundException('Return ID not found');
      }

      if (returnRequest.returnStatus !== ReturnStatus.WAITING_APPROVAL) {
        throw new BadRequestException('Return request is not in waiting approval status');
      }



      const returnItems = returnRequest.items.filter(
        item => item.status !== ReturnItemStatus.SPLIT,
      );

      const processedAt = new Date();

      const walletRefundItems: ReturnItem[] = [];
      const replacementItems: ReturnItem[] = [];
      const sourceRefundItems: ReturnItem[] = [];
      for (const incoming of incomingItems) {
        const match = returnItems.find(item => item.id === incoming.returnItemId);

        if (!match) {
          throw new BadRequestException(`Item mismatch for returnItemId: ${incoming.returnItemId}`);
        }

        match.resolutionMethod = incoming.action;
        match.status = ReturnItemStatus.COMPLETED;
        match.resolutionDate = processedAt;
        match.resolutionDate = processedAt;
        if (match.resolutionMethod === ReturnResolutionMethod.WALLET_REFUND) {
          walletRefundItems.push(match);
        } else if (match.resolutionMethod === ReturnResolutionMethod.REPLACEMENT) {
          replacementItems.push(match);
        }

      }
      returnRequest.returnStatus = ReturnStatus.PROCESSED;
      returnRequest.processedDate = processedAt;


      await manager.getRepository(ReturnItem).save(returnItems);
      await manager.getRepository(Return).save(returnRequest);



      if (walletRefundItems.length === 0 && replacementItems.length === 0 && sourceRefundItems.length === 0) {
        throw new BadRequestException('No valid return items found for processing');
      }
      if (walletRefundItems.length > 0) {
        if (!returnRequest || !returnRequest.order?.customer?.wallet) {
          throw new BadRequestException('Wallet not found for the return request.');
        }

        const walletId = returnRequest.order.customer.wallet.id;

        // Sum up totalAmount from walletRefundItems
        const totalRefundAmount = walletRefundItems.reduce((sum, item) => {
          return Number((sum + Number(item.totalAmount)).toFixed(2)); // ensure it's a number
        }, 0);



        // Call the wallet service method
        await this.walletService.refundToWallet(walletId, totalRefundAmount, manager);


      }

      if (replacementItems.length > 0) {

        try {
          await this.createReplacementOrder(replacementItems, returnRequest.order.id, manager);
        } catch (error) {
          console.error('Error creating replacement order:', error);
          throw new InternalServerErrorException('Failed to create replacement order');
        }
      }

      return { message: 'Return processed successfully' };
    });
  }

  async calculateItemAmount(item: any, newQuantity?: number): Promise<any> {

    const { sp, gstType, cgst, sgst, igst, deliveryCharge, deliveryShare, discount, quantity } = item;
    const actualQuantity = newQuantity ?? quantity;

    const originalSubTotal = sp * actualQuantity;
    const discountAmount = (originalSubTotal * discount) / 100;
    const subTotal = originalSubTotal - discountAmount;

    let itemCgstAmount = 0;
    let itemSgstAmount = 0;
    let itemIgstAmount = 0;
    let totalItemTax = 0;
    let totalAmount = 0;
    let totalTaxAmount = 0;
    let deliveryCgstAmount = 0;
    let deliverySgstAmount = 0;
    let deliveryIgstAmount = 0;
    let totalDeliveryTax = 0;
    const newDeliveryCharge = (deliveryCharge / quantity) * actualQuantity;
    const newDeliveryShare = (deliveryShare / quantity) * actualQuantity;

    if (gstType === GstType.CGST_SGST) {
      itemCgstAmount = (subTotal * cgst) / 100;
      itemSgstAmount = (subTotal * sgst) / 100;
      totalItemTax = itemCgstAmount + itemSgstAmount;
      deliveryCgstAmount = (newDeliveryCharge * cgst) / 100;
      deliverySgstAmount = (newDeliveryCharge * sgst) / 100;
      totalDeliveryTax = deliveryCgstAmount + deliverySgstAmount;
    } else if (gstType === GstType.IGST) {
      itemIgstAmount = (subTotal * igst) / 100;
      totalItemTax = itemIgstAmount;
      deliveryIgstAmount = (newDeliveryCharge * igst) / 100;
      totalDeliveryTax = deliveryIgstAmount;
    }

    totalTaxAmount = totalDeliveryTax + totalItemTax;
    totalAmount = subTotal + newDeliveryCharge + totalTaxAmount;

    const round = (value: number) => Number(value.toFixed(2));

    return {
      originalSubTotal: round(originalSubTotal),
      subTotal: round(subTotal),
      itemCgstAmount: round(itemCgstAmount),
      itemSgstAmount: round(itemSgstAmount),
      itemIgstAmount: round(itemIgstAmount),
      deliveryCgstAmount: round(deliveryCgstAmount),
      deliverySgstAmount: round(deliverySgstAmount),
      deliveryIgstAmount: round(deliveryIgstAmount),
      totalDeliveryTax: round(totalDeliveryTax),
      totalItemTax: round(totalItemTax),
      totalAmount: round(totalAmount),
      deliveryShare: round(newDeliveryShare),
      deliveryCharge: round(newDeliveryCharge),
      totalTaxAmount: round(totalTaxAmount),
      discountAmount: round(discountAmount),

    };
  }


  async createReplacementOrder(
    items: any,
    originalOrderId: number,
    manager: EntityManager,
  ): Promise<void> {

    // Use manager to interact with the database
    const originalOrder = await manager.findOne(Order, {
      where: { id: originalOrderId },
      relations: ['customer'],
    });

    if (!originalOrder) {
      throw new Error('Original order not found');
    }



    // Create new order entity for replacement
    const replacementOrder = manager.create(Order, {
      customer: originalOrder.customer,
      isReplacement: true,
      replacementForOrderId: originalOrder.id,
      orderStatus: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      razorpayOrderId: 'replacement_' + originalOrder.razorpayOrderId,
      totalAmount: 0,
      paidAmount: 0,
      subTotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      deliveryCharge: 0,
      originalSubtotal: 0,
      totalDeliveryTax: 0,
      totalItemTax: 0,
      walletAmountUsed: 0,
      billingName: originalOrder.billingName,
      billingPhoneNumber: originalOrder.billingPhoneNumber,
      billingEmailId: originalOrder.billingEmailId,
      billingStreetAddress: originalOrder.billingStreetAddress,
      billingCity: originalOrder.billingCity,
      billingState: originalOrder.billingState,
      billingPincode: originalOrder.billingPincode,
      billingCountry: originalOrder.billingCountry,
      shippingName: originalOrder.shippingName,
      shippingPhoneNumber: originalOrder.shippingPhoneNumber,
      shippingEmailId: originalOrder.shippingEmailId,
      shippingStreetAddress: originalOrder.shippingStreetAddress,
      shippingCity: originalOrder.shippingCity,
      shippingState: originalOrder.shippingState,
    });

    await manager.save(Order, replacementOrder);

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const available = await this.stockMovementsService.getNetQuantityForStockAndStage(
        item.orderItem.stock.id,
        StockStage.AVAILABLE,
      );

      if (available < item.quantity) {
        throw new BadRequestException(`Insufficient stock for stock ID ${item.stockId}`);
      }


      const orderItem = manager.create(OrderItem, {
        order: replacementOrder,
        productVariant: item.orderItem.productVariant,
        quantity: item.quantity,
        stock: item.orderItem.stock.id,
        sp: 0,
        mrp: 0,
        subTotal: 0,
        taxAmount: 0,
        itemCgstAmount: 0,
        itemSgstAmount: 0,
        itemIgstAmount: 0,
        deliverySgstAmount: 0,
        deliveryCgstAmount: 0,
        deliveryIgstAmount: 0,
        itemTaxAmount: 0,
        totalTaxAmount: 0,
        deliveryTaxAmount: 0,
        totalAmount: 0,
        deliveryShare: 0,
        deliveryCharge: 0,
        gstType: item.orderItem.gstType,
        cgst: 0,
        sgst: 0,

        // other fields
      });
      orderItems.push(orderItem);
    }


    const savedOrderItems = await manager.save(OrderItem, orderItems);

    const orderItemIds = savedOrderItems.map(item => item.id);

    const reloadedOrderItems = await manager.find(OrderItem, {
      where: { id: In(orderItemIds) },
      relations: ['stock', 'order'], // add other needed relations
    });

    const movements = reloadedOrderItems.map(orderItem => ({
      stockId: orderItem.stock.id,
      orderItemId: orderItem.id,
      orderId: replacementOrder.id,
      quantity: orderItem.quantity,
      from: StockStage.AVAILABLE,
      to: StockStage.RESERVED,
    }));

    await this.stockMovementsService.createMovements(movements, manager);
  }

  async getReturnsWithWalletRefundItemsInRange(filters: any): Promise<Return[]> {
    const where: any = {};

    if (filters.startDate && filters.endDate) {
      const start = new Date(`${filters.startDate}T00:00:00.000Z`)
      const end = new Date(`${filters.endDate}T23:59:59.999Z`);
      where.processedDate = Between(start, end);
    } else if (filters.startDate) {
      const start = new Date(`${filters.startDate}T00:00:00.000Z`)
      where.processedDate = MoreThanOrEqual(start);
    }
    else if (filters.endDate) {
      const end = new Date(`${filters.endDate}T23:59:59.999Z`);
      where.createdAt = LessThanOrEqual(end);

    }

    const returns = await this.returnRepository.find({
      where,
      relations: ['items.orderItem'],
    });

    return returns
      .map(ret => ({
        ...ret,
        items: ret.items.filter(
          item => item.resolutionMethod === ReturnResolutionMethod.WALLET_REFUND,
        ),
      }))
      .filter(ret => ret.items.length > 0);
  }





}
