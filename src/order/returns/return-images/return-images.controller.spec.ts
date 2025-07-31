import { Test, TestingModule } from '@nestjs/testing';
import { ReturnImagesController } from './return-images.controller';
import { ReturnImagesService } from './return-images.service';

describe('ReturnImagesController', () => {
  let controller: ReturnImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnImagesController],
      providers: [ReturnImagesService],
    }).compile();

    controller = module.get<ReturnImagesController>(ReturnImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
