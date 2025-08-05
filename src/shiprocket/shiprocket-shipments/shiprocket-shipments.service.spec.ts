import { Test, TestingModule } from '@nestjs/testing';
import { ShiprocketShipmentsService } from './shiprocket-shipments.service';

describe('ShiprocketShipmentsService', () => {
  let service: ShiprocketShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShiprocketShipmentsService],
    }).compile();

    service = module.get<ShiprocketShipmentsService>(ShiprocketShipmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
