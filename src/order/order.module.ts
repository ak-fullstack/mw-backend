import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';
import { RefundsModule } from './refunds/refunds.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [OrdersModule, OrderItemsModule, PaymentsModule, RefundsModule, SuppliersModule]
})
export class OrderModule {}
