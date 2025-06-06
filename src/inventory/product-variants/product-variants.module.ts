import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from '../products/entities/product.entity';
import { GoogleCloudStorageService } from 'src/google-cloud-storage/google-cloud-storage.service';
import { ProductImage } from '../product-images/entities/product-image.entity';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, GoogleCloudStorageService],
  imports: [TypeOrmModule.forFeature([ProductVariant, Product, ProductImage])],

})
export class ProductVariantsModule { }
