import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { StockMovement } from './entities/stock-movement.entity';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post('create')
  async createBulk(
    @Body() body: CreateStockMovementDto[],
  ): Promise<StockMovement[]> {
    return this.stockMovementsService.createMovements(body);
  }


  @Get('stage-summary')
  async getNetQuantitiesByStage() {
    return this.stockMovementsService.getNetStockStageQuantities();
  }

  @Get('stock-stages')
  getStages() {
    return this.stockMovementsService.getStockStages();
  }

  

}
