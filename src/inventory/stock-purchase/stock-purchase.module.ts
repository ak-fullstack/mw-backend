import { Module } from '@nestjs/common';
import { StockPurchaseService } from './stock-purchase.service';
import { StockPurchaseController } from './stock-purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPurchase } from './entities/stock-purchase.entity';

@Module({
  controllers: [StockPurchaseController],
  providers: [StockPurchaseService],
  imports: [TypeOrmModule.forFeature([StockPurchase])],
})
export class StockPurchaseModule {}
