import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import {  RequirePermissions } from 'src/decorators/permission.decorator';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) { }

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(createStockDto);
  }

  @Post('get-stocks-by-ids')
  @Roles('FAM_MEMBER')
  @UseGuards(JwtAuthGuard,RolesGuard)
  async getBulkStocks(@Body() body: { stockId: number; quantity: number }[]) {
    return this.stocksService.getStocksByIds(body);
  }

  @Get('latest-by-product')
  async getLatestStockPerProduct() {
    return this.stocksService.getLatestStockPerProduct();
  }


  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('UPDATE_STOCK_APPROVAL')
  async approveStock(@Param('id') id: string) {
    return this.stocksService.approve(+id);
  }

  @Patch('toggleSale/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('UPDATE_STOCK_ONSALE')
  async toggleSale(@Param('id') id: string) {
    return this.stocksService.toggleSale(+id);
  }


  
}
