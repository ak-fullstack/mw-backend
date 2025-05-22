import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
    imports: [TypeOrmModule.forFeature([ProductVariant,Product])],
  
})
export class ProductVariantsModule {}
