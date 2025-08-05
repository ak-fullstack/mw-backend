import { Test, TestingModule } from '@nestjs/testing';
import { ShiprocketShipmentsController } from './shiprocket-shipments.controller';
import { ShiprocketShipmentsService } from './shiprocket-shipments.service';

describe('ShiprocketShipmentsController', () => {
  let controller: ShiprocketShipmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiprocketShipmentsController],
      providers: [ShiprocketShipmentsService],
    }).compile();

    controller = module.get<ShiprocketShipmentsController>(ShiprocketShipmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
