import { Test, TestingModule } from '@nestjs/testing';
import { EodClosureService } from './eod-closure.service';

describe('EodClosureService', () => {
  let service: EodClosureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EodClosureService],
    }).compile();

    service = module.get<EodClosureService>(EodClosureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
