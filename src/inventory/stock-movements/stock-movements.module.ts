import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  imports:[TypeOrmModule.forFeature([StockMovement])],
  exports:[StockMovementsService]
})
export class StockMovementsModule {}
