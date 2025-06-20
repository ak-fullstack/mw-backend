import { Test, TestingModule } from '@nestjs/testing';
import { ReturnItemsController } from './return-items.controller';
import { ReturnItemsService } from './return-items.service';

describe('ReturnItemsController', () => {
  let controller: ReturnItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnItemsController],
      providers: [ReturnItemsService],
    }).compile();

    controller = module.get<ReturnItemsController>(ReturnItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
