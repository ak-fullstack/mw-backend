import { Test, TestingModule } from '@nestjs/testing';
import { ShiprocketStatusLogController } from './shiprocket-status-log.controller';
import { ShiprocketStatusLogService } from './shiprocket-status-log.service';

describe('ShiprocketStatusLogController', () => {
  let controller: ShiprocketStatusLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiprocketStatusLogController],
      providers: [ShiprocketStatusLogService],
    }).compile();

    controller = module.get<ShiprocketStatusLogController>(ShiprocketStatusLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
