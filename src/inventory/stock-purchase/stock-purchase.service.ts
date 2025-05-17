import { Injectable } from '@nestjs/common';
import { CreateStockPurchaseDto } from './dto/create-stock-purchase.dto';
import { UpdateStockPurchaseDto } from './dto/update-stock-purchase.dto';

@Injectable()
export class StockPurchaseService {
  create(createStockPurchaseDto: CreateStockPurchaseDto) {
    return 'This action adds a new stockPurchase';
  }

  findAll() {
    return `This action returns all stockPurchase`;
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
