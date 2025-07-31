import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StockPurchaseService } from './stock-purchase.service';
import { CreateStockPurchaseDto } from './dto/create-stock-purchase.dto';
import { UpdateStockPurchaseDto } from './dto/update-stock-purchase.dto';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('stock-purchase')
export class StockPurchaseController {
  constructor(private readonly stockPurchaseService: StockPurchaseService) { }


  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions(PermissionEnum.READ_STOCK)
  findAllWithStocks() {
    return this.stockPurchaseService.findAllWithStocks();
  }


}
