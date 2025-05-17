import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockPurchaseService } from './stock-purchase.service';
import { CreateStockPurchaseDto } from './dto/create-stock-purchase.dto';
import { UpdateStockPurchaseDto } from './dto/update-stock-purchase.dto';

@Controller('stock-purchase')
export class StockPurchaseController {
  constructor(private readonly stockPurchaseService: StockPurchaseService) {}

  @Post()
  create(@Body() createStockPurchaseDto: CreateStockPurchaseDto) {
    return this.stockPurchaseService.create(createStockPurchaseDto);
  }

  @Get()
  findAll() {
    return this.stockPurchaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockPurchaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockPurchaseDto: UpdateStockPurchaseDto) {
    return this.stockPurchaseService.update(+id, updateStockPurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockPurchaseService.remove(+id);
  }
}
