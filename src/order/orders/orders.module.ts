import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,RazorpayService],
imports: [TypeOrmModule.forFeature([Order])]
})
export class OrdersModule {}
