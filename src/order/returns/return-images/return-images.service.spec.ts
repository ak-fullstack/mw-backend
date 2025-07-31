import { Test, TestingModule } from '@nestjs/testing';
import { ReturnImagesService } from './return-images.service';

describe('ReturnImagesService', () => {
  let service: ReturnImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnImagesService],
    }).compile();

    service = module.get<ReturnImagesService>(ReturnImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
