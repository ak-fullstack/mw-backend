import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerAddress } from 'src/customer/customer-address/entities/customer-address.entity';
import { RazorpayModule } from 'src/razorpay/razorpay.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
imports: [TypeOrmModule.forFeature([Order,Stock,Customer,CustomerAddress]),RazorpayModule,QrCodeModule]
})
export class OrdersModule {}
