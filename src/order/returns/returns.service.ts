import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { DataSource, Not, Repository } from 'typeorm';
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

@Injectable()
export class ReturnsService {


  constructor(private dataSource: DataSource,
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepository: Repository<ReturnItem>,
    private stockMovementsService: StockMovementsService
  ) {

  }

  async create(createReturnDto: CreateReturnDto, customerId: number) {
    return this.dataSource.transaction(async manager => {
      // 1. Verify order belongs to customer
      const order = await manager.findOne(Order, {
        where: { id: createReturnDto.orderId, customerId },
      });

      if (!order) {
        throw new BadRequestException('Order not found or does not belong to the customer');
      }

      if (order.orderStatus !== OrderStatus.DELIVERED) {
        throw new BadRequestException('Return can only be created for delivered orders');
      }

      const existingReturn = await manager.findOne(Return, {
        where: { order: { id: createReturnDto.orderId } },
      });

      if (existingReturn) {
        throw new BadRequestException('A return request already exists for this order');
      }
      const deliveryDate = new Date(order.deliveredAt);
      const today = new Date();
      const diffInDays = (today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays > 7) {
        throw new BadRequestException('Return request is allowed only within 7 days of delivery');
      }

      const orderItems = await manager.find(OrderItem, {
        where: { order: { id: createReturnDto.orderId } },
      });
      const validOrderItemIds = new Set(orderItems.map(item => item.id));


      const seen = new Set<number>();
      for (const item of createReturnDto.items) {
        if (seen.has(item.orderItemId)) {
          throw new BadRequestException(
            `Duplicate orderItemId found: ${item.orderItemId}. Each item must appear only once.`
          );
        }
        seen.add(item.orderItemId);
      }

      // 3. Validate all incoming orderItemIds
      for (const item of createReturnDto.items) {
        if (!validOrderItemIds.has(item.orderItemId)) {
          throw new BadRequestException(
            `OrderItem ID ${item.orderItemId} does not belong to order ${createReturnDto.orderId}`
          );
        }

        const matchedOrderItem = orderItems.find(o => o.id === item.orderItemId);
        if (!matchedOrderItem) continue; // safety, though it should never happen

        if (item.quantity > matchedOrderItem.quantity) {
          throw new BadRequestException(
            `Return quantity for item ${item.orderItemId} cannot be more than ordered quantity (${matchedOrderItem.quantity})`
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

      for (const item of createReturnDto.items) {
        const returnItem = manager.create(ReturnItem, {
          returnRequest: { id: savedReturn.id },  // or just use savedReturn if you're using full entity
          orderItem: { id: item.orderItemId },    // ✅ No need to fetch full OrderItem
          quantity: item.quantity,
          reason: item.reason,
          status: ReturnItemStatus.RETURN_REQUESTED,
        });

        await manager.save(ReturnItem, returnItem);
      }

      return { message: 'Return request Successfully created' }
    });


  }


  async getAllReturns(): Promise<any> {
  return this.returnRepository
    .createQueryBuilder('return')
    .leftJoinAndSelect('return.items', 'item', 'item.status != :splitStatus', {
      splitStatus: ReturnItemStatus.SPLIT,
    })
    .leftJoinAndSelect('item.orderItem', 'orderItem')
    .leftJoinAndSelect('orderItem.productVariant', 'productVariant')
    .leftJoinAndSelect('productVariant.product', 'product')
    .where('return.returnStatus != :waitingApprovalStatus', {
      waitingApprovalStatus: ReturnStatus.WAITING_APPROVAL,
    })
    .orderBy('return.createdAt', 'DESC')
    .getMany();
}

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
      await manager.save(ReturnItem, returnItems);
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
    }[];
  }): Promise<any> {
    const { returnId, items: incomingItems } = payload;

    return await this.dataSource.transaction(async (manager) => {
      // Step 1: Get original return items
      const originalReturnItems = await manager.find(ReturnItem, {
        where: {
          returnRequest: { id: returnId },
        },
        relations: ['returnRequest', 'orderItem'],
      });

      if (originalReturnItems.length === 0) {
        throw new BadRequestException(`No return items found for returnId ${returnId}`);
      }

      // Step 2: Group incoming items by returnItemId and sum their quantity
      const groupedIncoming = incomingItems.reduce((acc, item) => {
        acc[item.returnItemId] = (acc[item.returnItemId] || 0) + item.quantity;
        return acc;
      }, {} as Record<number, number>);

      // Step 3: Compare each original returnItem with summed incoming quantity
      for (const original of originalReturnItems) {
        const incomingQty = groupedIncoming[original.id] || 0;
        if (incomingQty !== original.quantity) {
          throw new BadRequestException(
            `Quantity mismatch for returnItemId ${original.id}: expected ${original.quantity}, received ${incomingQty}`
          );
        }
      }

      // Step 4: Validate for extra returnItemIds
      const originalIds = new Set(originalReturnItems.map(i => i.id));
      for (const returnItemId of Object.keys(groupedIncoming)) {
        if (!originalIds.has(Number(returnItemId))) {
          throw new BadRequestException(
            `Invalid returnItemId ${returnItemId} in incoming items. Not part of original return items for returnId ${returnId}`
          );
        }
      }

      // Step 5: Update return request status
      const returnRequest = await manager.findOneByOrFail(Return, { id: returnId });
      returnRequest.returnStatus = ReturnStatus.WAITING_APPROVAL;
      await manager.save(returnRequest);

      // Step 6: Process return items
      for (const original of originalReturnItems) {
        const matchingIncoming = incomingItems.filter(i => i.returnItemId === original.id);
        const totalIncomingQty = matchingIncoming.reduce((sum, i) => sum + i.quantity, 0);

        if (matchingIncoming.length === 1 && matchingIncoming[0].quantity === original.quantity) {
          // No split needed
          original.status = ReturnItemStatus.WAITING_APPROVAL;
          original.itemCondition = matchingIncoming[0].itemCondition;
          await manager.save(original);
        } else {
          // Split needed
          original.status = ReturnItemStatus.SPLIT;
          await manager.save(original);

          for (const incoming of matchingIncoming) {
            const newItem = manager.create(ReturnItem, {
              returnRequest: original.returnRequest,
              orderItem: original.orderItem,
              quantity: incoming.quantity,
              itemCondition: incoming.itemCondition,
              status: ReturnItemStatus.WAITING_APPROVAL,
            });

            await manager.save(newItem);
          }
        }
      }

      const returnItems = await manager.find(ReturnItem, {
        where: {
          returnRequest: { id: returnId },
          status: Not(ReturnItemStatus.SPLIT), 
        },
        relations: ['orderItem', 'orderItem.stock', 'orderItem.order'],
      });

      console.log(returnItems);
      

      const movements = returnItems.map((item) => ({
        stockId: item.orderItem.stock.id,
        orderItemId: item.orderItem.id,
        orderId: item.orderItem.order.id,
        quantity: item.quantity,
        from: StockStage.RETURNED,
        to:
          item.itemCondition === ReturnItemCondition.GOOD
            ? StockStage.AVAILABLE
            : StockStage.DAMAGED,
      }));

      await this.stockMovementsService.createMovements(movements, manager);

      return { message: 'Return items verified and moved to approval', returnId };
    });
  }

  async processReturn(payload: {
  returnId: number;
  items: {
    stockId: number;
    returnItemId: number;
    quantity: number;
    action: ReturnItemStatus;
  }[];
}): Promise<any> {
  const { returnId, items: incomingItems } = payload;

  // 1. Find the return entry
  const returnEntry = await this.returnRepository.findOne({
    where: { id: returnId },
    relations: ['returnItems', 'returnItems.orderItem', 'returnItems.orderItem.stock'],
  });

  if (!returnEntry) {
    throw new NotFoundException('Return ID not found');
  }

  // 2. Filter out items with status SPLIT
  const originalItems = returnEntry.items.filter(item => item.status !== ReturnItemStatus.SPLIT);

  // 3. Compare each item with input
  for (const incoming of incomingItems) {
    const match = originalItems.find(item =>
      item.id === incoming.returnItemId &&
      item.quantity === incoming.quantity &&
      item.orderItem?.stock?.id === incoming.stockId
    );

    if (!match) {
      throw new BadRequestException(`Item mismatch for returnItemId: ${incoming.returnItemId}`);
    }

    // 4. Update each matched item's status
    match.status = incoming.action;
    await this.returnItemRepository.save(match);
  }

  // 5. Optionally mark the overall return as PROCESSED
  returnEntry.returnStatus = ReturnStatus.PROCESSED;
  await this.returnRepository.save(returnEntry);

  return { message: 'Return processed successfully' };
}


}
