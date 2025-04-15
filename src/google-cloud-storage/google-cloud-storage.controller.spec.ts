import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCloudStorageController } from './google-cloud-storage.controller';
import { GoogleCloudStorageService } from './google-cloud-storage.service';

describe('GoogleCloudStorageController', () => {
  let controller: GoogleCloudStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCloudStorageController],
      providers: [GoogleCloudStorageService],
    }).compile();

    controller = module.get<GoogleCloudStorageController>(GoogleCloudStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
