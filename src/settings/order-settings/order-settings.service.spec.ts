import { Test, TestingModule } from '@nestjs/testing';
import { OrderSettingsService } from './order-settings.service';

describe('OrderSettingsService', () => {
  let service: OrderSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderSettingsService],
    }).compile();

    service = module.get<OrderSettingsService>(OrderSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
