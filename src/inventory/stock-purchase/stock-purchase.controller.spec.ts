import { Test, TestingModule } from '@nestjs/testing';
import { StockPurchaseController } from './stock-purchase.controller';
import { StockPurchaseService } from './stock-purchase.service';

describe('StockPurchaseController', () => {
  let controller: StockPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockPurchaseController],
      providers: [StockPurchaseService],
    }).compile();

    controller = module.get<StockPurchaseController>(StockPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
