import { Test, TestingModule } from '@nestjs/testing';
import { OrderSettingsController } from './order-settings.controller';
import { OrderSettingsService } from './order-settings.service';

describe('OrderSettingsController', () => {
  let controller: OrderSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderSettingsController],
      providers: [OrderSettingsService],
    }).compile();

    controller = module.get<OrderSettingsController>(OrderSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
