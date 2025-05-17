import { Test, TestingModule } from '@nestjs/testing';
import { StockPurchaseService } from './stock-purchase.service';

describe('StockPurchaseService', () => {
  let service: StockPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPurchaseService],
    }).compile();

    service = module.get<StockPurchaseService>(StockPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
