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
import { StockMovementsModule } from 'src/inventory/stock-movements/stock-movements.module';
import { Return } from '../returns/entities/return.entity';
import { ReturnsModule } from '../returns/returns.module';
import { WalletModule } from 'src/customer/wallet/wallet.module';
import { OrderSettingsModule } from 'src/settings/order-settings/order-settings.module';
import { ShiprocketShipmentsModule } from 'src/shiprocket/shiprocket-shipments/shiprocket-shipments.module';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
imports: [TypeOrmModule.forFeature([Order,Stock,Customer,CustomerAddress,Return]),RazorpayModule,QrCodeModule,StockMovementsModule,ReturnsModule,WalletModule,OrderSettingsModule,ShiprocketShipmentsModule,SocketsModule],
exports:[OrdersService]
})
export class OrdersModule {}
