import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
    imports: [TypeOrmModule.forFeature([ProductImage])],
  
})
export class ProductImagesModule {}
