import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { DataSource } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { OrderStatus } from 'src/enum/order-status.enum';
import { ReturnItem } from '../return-items/entities/return-item.entity';
import { Return } from './entities/return.entity';

@Injectable()
export class ReturnsService {


  constructor(private dataSource: DataSource) {

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
          status: 'PENDING',
        });

        await manager.save(ReturnItem, returnItem);
      }

      return { message: 'Return request Successfully created' }
    });


  }

}
