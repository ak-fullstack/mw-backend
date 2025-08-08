import { Module } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { GoogleCloudStorageController } from './google-cloud-storage.controller';

@Module({
  controllers: [GoogleCloudStorageController],
  providers: [GoogleCloudStorageService],
  exports:[GoogleCloudStorageService]
})
export class GoogleCloudStorageModule {}
