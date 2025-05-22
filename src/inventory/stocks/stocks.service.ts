import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StockPurchase } from '../stock-purchase/entities/stock-purchase.entity';
import { Stock } from './entities/stock.entity';
import { VariantDto } from './dto/create-stock.dto';

@Injectable()
export class StocksService {

  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateStockDto) {
    return this.dataSource.transaction(async (manager) => {
      // Step 1: Create StockPurchase entity
      const purchase = manager.create(StockPurchase, {
        billRefNo: dto.billRefNo,
        supplierName: dto.supplierName,
        purchaseDate: dto.purchaseDate,
        totalAmount: dto.totalAmount,
      });

      const savedPurchase = await manager.save(StockPurchase, purchase);

      // Step 2: Create Stock entities from variants
      const stockEntities = dto.variants.map((v: any) => {
        const stock = new Stock();
        stock.purchase = savedPurchase;
        stock.productVariant = { id: v.variantId } as any; // just the id
        stock.sku = v.sku;
        stock.quantity = v.quantity;
        stock.ctc = v.ctc;
        stock.mrp = v.mrp;
        stock.sp = v.sp;
        stock.discount = v.discount;
        stock.cgst = v.cgst;
        stock.sgst = v.sgst;
        stock.igst = v.igst;
        stock.used = 0; // default
        return stock;
      });

      // Step 3: Save all stock entries
      await manager.save(Stock, stockEntities);

      return { success: true, purchaseId: savedPurchase.id };
    });
  }

  findAll() {
    return `This action returns all stocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
