import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovement } from './entities/stock-movement.entity';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) { }

  async createBulk(
    @Body() body: CreateStockMovementDto[],
  ): Promise<StockMovement[]> {
    return this.stockMovementsService.createMovements(body);
  }


  @Get('stage-summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_STOCK)
  async getNetQuantitiesByStage() {
    return this.stockMovementsService.getNetStockStageQuantities();
  }

  @Get('stock-stages')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_STOCK)
  getStages() {
    return this.stockMovementsService.getStockStages();
  }



}
