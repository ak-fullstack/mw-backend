import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { GoogleCloudStorageModule } from 'src/google-cloud-storage/google-cloud-storage.module';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  imports: [TypeOrmModule.forFeature([ProductImage]), GoogleCloudStorageModule],

})
export class ProductImagesModule { }
