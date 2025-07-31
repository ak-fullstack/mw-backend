import { Test, TestingModule } from '@nestjs/testing';
import { EodClosureController } from './eod-closure.controller';
import { EodClosureService } from './eod-closure.service';

describe('EodClosureController', () => {
  let controller: EodClosureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EodClosureController],
      providers: [EodClosureService],
    }).compile();

    controller = module.get<EodClosureController>(EodClosureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
