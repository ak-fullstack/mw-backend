import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';

@Module({
  controllers: [StocksController],
  providers: [StocksService],
    imports: [TypeOrmModule.forFeature([Stock])],
  
})
export class StocksModule {}
