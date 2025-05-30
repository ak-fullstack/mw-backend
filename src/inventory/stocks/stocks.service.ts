import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockPurchase } from '../stock-purchase/entities/stock-purchase.entity';
import { Stock } from './entities/stock.entity';
import { VariantDto } from './dto/create-stock.dto';

@Injectable()
export class StocksService {

  constructor(private readonly dataSource: DataSource, @InjectRepository(Stock)
      private readonly stockRepository: Repository<Stock>,) {}

  async create(dto: CreateStockDto) {
  return this.dataSource.transaction(async (manager) => {
    // Step 1: Create StockPurchase entity with supplier relation
    const purchase = manager.create(StockPurchase, {
      billRefNo: dto.billRefNo,
      supplier: { id: dto.supplierId },  // Use supplierId here as relation
      purchaseDate: dto.purchaseDate,
      totalAmount: dto.totalAmount,
      gstType: dto.gstType, // if you have gstType field in StockPurchase entity
    });

    const savedPurchase = await manager.save(StockPurchase, purchase);

    // Step 2: Create Stock entities from variants
    const stockEntities = dto.variants.map((v: any) => {
      const stock = new Stock();
      stock.purchase = savedPurchase;
      stock.productVariant = { id: v.variantId } as any;
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


async getLatestStockPerProduct() {
  const subQuery = this.stockRepository
    .createQueryBuilder('subStock')
    .select('subStock.productVariantId', 'productVariantId')
    .addSelect('MAX(subPurchase.purchaseDate)', 'latestPurchaseDate')
    .innerJoin('subStock.purchase', 'subPurchase')
    .groupBy('subStock.productVariantId');

  const stocks = await this.stockRepository
    .createQueryBuilder('stock')
    .innerJoin('stock.purchase', 'purchase')
    .innerJoin('stock.productVariant', 'productVariant')
    .innerJoin('productVariant.product', 'product')
    .leftJoin('productVariant.color', 'color')
    .leftJoin('productVariant.size', 'size')
    .innerJoin(
      '(' + subQuery.getQuery() + ')',
      'latest',
      'latest.productVariantId = stock.productVariantId AND latest.latestPurchaseDate = purchase.purchaseDate'
    )
    .setParameters(subQuery.getParameters())
    .addSelect('stock.quantity - stock.used - stock.reserved', 'available')
    .select([
      'stock',
      'purchase',
      'productVariant',
      'product',
      'color',
      'size',
    ])
    .getRawAndEntities();

  // Map available into entities
  return stocks.entities.map((entity, idx) => ({
    ...entity,
    available: Number(stocks.raw[idx].available),
  }));
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
