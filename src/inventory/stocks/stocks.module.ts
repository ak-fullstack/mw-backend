import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  controllers: [StocksController],
  providers: [StocksService],
    imports: [StockMovementsModule, TypeOrmModule.forFeature([Stock,ProductVariant])],
  
})
export class StocksModule {}
