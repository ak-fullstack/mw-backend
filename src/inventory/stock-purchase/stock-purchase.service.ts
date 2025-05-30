import { Injectable } from '@nestjs/common';
import { CreateStockPurchaseDto } from './dto/create-stock-purchase.dto';
import { UpdateStockPurchaseDto } from './dto/update-stock-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockPurchase } from './entities/stock-purchase.entity';
import { Repository } from 'typeorm';
import { Stock } from '../stocks/entities/stock.entity';

@Injectable()
export class StockPurchaseService {

    constructor(
    @InjectRepository(StockPurchase)
    private readonly stockPurchaseRepo: Repository<StockPurchase>,
  ) {}

async findAllWithStocks(): Promise<StockPurchase[]> {
  return this.stockPurchaseRepo.find({
    relations: [
      'stocks',
      'stocks.productVariant',
      'stocks.productVariant.product',
      'stocks.productVariant.size',
      'stocks.productVariant.color',
    ],
    order: { purchaseDate: 'DESC' },
  });
}




    create(createStockPurchaseDto: CreateStockPurchaseDto) {
    return 'This action adds a new stockPurchase';
  }


  findOne(id: number) {
    return `This action returns a #${id} stockPurchase`;
  }

  update(id: number, updateStockPurchaseDto: UpdateStockPurchaseDto) {
    return `This action updates a #${id} stockPurchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockPurchase`;
  }
}
