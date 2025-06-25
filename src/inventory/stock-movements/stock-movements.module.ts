import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { StocksModule } from '../stocks/stocks.module';
import { Stock } from '../stocks/entities/stock.entity';

@Module({
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  imports:[TypeOrmModule.forFeature([StockMovement,Stock])],
  exports:[StockMovementsService]
})
export class StockMovementsModule {}
