import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';
import { RefundsModule } from './refunds/refunds.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ReturnsModule } from './returns/returns.module';
import { ReturnItemsModule } from './return-items/return-items.module';

@Module({
  imports: [OrdersModule, OrderItemsModule, PaymentsModule, RefundsModule, SuppliersModule, ReturnsModule, ReturnItemsModule]
})
export class OrderModule {}
