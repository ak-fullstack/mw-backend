import { Test, TestingModule } from '@nestjs/testing';
import { ShiprocketStatusLogService } from './shiprocket-status-log.service';

describe('ShiprocketStatusLogService', () => {
  let service: ShiprocketStatusLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShiprocketStatusLogService],
    }).compile();

    service = module.get<ShiprocketStatusLogService>(ShiprocketStatusLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
