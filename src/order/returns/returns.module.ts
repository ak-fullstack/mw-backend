import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Return } from './entities/return.entity';
import { ReturnItem } from '../return-items/entities/return-item.entity';
import { StockMovementsModule } from 'src/inventory/stock-movements/stock-movements.module';
import { WalletModule } from 'src/customer/wallet/wallet.module';
import { ReturnImagesModule } from './return-images/return-images.module';

@Module({
  controllers: [ReturnsController],
  providers: [ReturnsService],
  imports:[TypeOrmModule.forFeature([ReturnItem,Return]),StockMovementsModule,WalletModule, ReturnImagesModule],
  exports:[ReturnsService]
})
export class ReturnsModule {}
