import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Module({
  controllers: [StocksController],
  providers: [StocksService],
    imports: [TypeOrmModule.forFeature([Stock,ProductVariant])],
  
})
export class StocksModule {}
