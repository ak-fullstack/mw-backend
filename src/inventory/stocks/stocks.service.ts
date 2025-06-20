import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { StockPurchase } from '../stock-purchase/entities/stock-purchase.entity';
import { Stock } from './entities/stock.entity';
import { VariantDto } from './dto/create-stock.dto';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { StockStage } from 'src/enum/stock-stages.enum';
import { StockMovementsService } from '../stock-movements/stock-movements.service';

@Injectable()
export class StocksService {

  constructor(
    private readonly stockMovementsService: StockMovementsService,
    private readonly dataSource: DataSource,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>
  ) { }

  async create(createStockdto: CreateStockDto) {
  return this.dataSource.transaction(async (manager) => {
    const purchase = manager.create(StockPurchase, {
      billRefNo: createStockdto.billRefNo,
      supplier: { id: createStockdto.supplierId },
      purchaseDate: createStockdto.purchaseDate,
      totalAmount: createStockdto.totalAmount,
      totalTax: createStockdto.totalTax,
      subTotal: createStockdto.subTotal,
      invoicePdfUrl: createStockdto.invoicePdfUrl,
      gstType: createStockdto.gstType,
    });

    const savedPurchase = await manager.save(StockPurchase, purchase);

    const stockEntities = createStockdto.variants.map((v: any) => {
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
      stock.used = 0;
      stock.igstAmount = v.igstAmount;
      stock.cgstAmount = v.cgstAmount;
      stock.sgstAmount = v.sgstAmount;
      stock.subTotal = v.subTotal;
      stock.totalTax = v.totalTax;
      stock.totalAmount = v.totalAmount;
      return stock;
    });

    const savedStocks = await manager.save(Stock, stockEntities);

    const movements = savedStocks.map((stock) => ({
      stockId: stock.id,
      quantity: stock.quantity,
      from: StockStage.SUPPLIER,
      to: StockStage.STORAGE,
    }));

    await this.stockMovementsService.createMovements(movements, manager);

    return { success: true, purchaseId: savedPurchase.id };
  });
}



  async getLatestStockPerProduct() {
    try {
      const stocks = await this.stockRepository.find({
        relations: ['productVariant', 'productVariant.product', 'productVariant.color', 'productVariant.size', 'productVariant.images', 'purchase'],
        select: {
          id: true,
          productVariant: {
            id: true,
            sku: true,
            product: {
              id: true,
              name: true,
              has_colors: true,
              has_sizes: true,
              description: true,
            },
            color: {
              id: true,
              name: true,
              hexCode: true,
            },
            size: {
              id: true,
              label: true,
            },
          },
          purchase: {
            id: true,
            purchaseDate: true,
          },
          quantity: true,
          used: true,
          reserved: true,
        }, where: { onSale: true }
      });

      // Keep only the latest stock per product variant
      const latestStocksMap = new Map<number, typeof stocks[0]>();

      for (const stock of stocks) {
        const variantId = stock.productVariant.id;
        const existing = latestStocksMap.get(variantId);

        if (
          !existing ||
          new Date(stock.purchase.purchaseDate) > new Date(existing.purchase.purchaseDate)
        ) {
          latestStocksMap.set(variantId, stock);
        }
      }

      // Final result: array of latest stocks
      const latestStocks = Array.from(latestStocksMap.values());

      // Optional: Add available stock calculation
      return latestStocks.map(stock => ({
        ...stock,
        available: (stock.quantity ?? 0) - (stock.used ?? 0) - (stock.reserved ?? 0),
      }));
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw new InternalServerErrorException('Failed to fetch stocks');
    }
  }



  async getStocksByIds(
    stockRequests: { stockId: number; quantity: number }[]
  ) {
    const stockIds = stockRequests.map(item => item.stockId);

    // Fetch stocks with productVariant and product relations
    const stocks = await this.stockRepository.find({
      where: { id: In(stockIds) },
      relations: ['productVariant', 'productVariant.product', 'productVariant.size', 'productVariant.color', 'productVariant.images'],
    });
    // Map the stocks in the order of the requests, include quantity from request
    return stockRequests.map(request => {
      const stock = stocks.find(s => s.id === request.stockId);
      if (!stock) return null; // or handle missing stocks as you prefer

      return {
        stockId: stock.id,
        cgst: stock.cgst,
        sgst: stock.sgst,
        igst: stock.igst,
        quantity: request.quantity,
        available: stock.available,
        sp: stock.sp,
        mrp: stock.mrp,
        discount: stock.discount,
        productName: stock.productVariant.product.name,
        description: stock.productVariant.product.description,
        size: stock.productVariant.size ? stock.productVariant.size.label : null,
        color: stock.productVariant.color ? stock.productVariant.color.name : null,
        image: stock.productVariant.images.length > 0 ? stock.productVariant.images[0].imageUrl : null,

      };
    }).filter(Boolean);
  }

  async approve(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['productVariant', 'productVariant.images'],
    });

    if (!stock) throw new NotFoundException('Stock not found');

    const images = stock.productVariant?.images ?? [];
    if (images.length === 0) {
      throw new BadRequestException('Cannot approve stock. Variant has no images.');
    }

    stock.approved = true;
    return this.stockRepository.save(stock);
  }

  async toggleSale(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { id } });
    if (!stock) throw new NotFoundException('Stock not found');
    if (!stock.approved) {
      throw new InternalServerErrorException('Stock must be approved before putting it on sale');
    }
    stock.onSale = !stock.onSale; // Toggle the onSale status
    return this.stockRepository.save(stock);
  }
}
