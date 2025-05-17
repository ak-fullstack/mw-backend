import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
    imports: [TypeOrmModule.forFeature([ProductVariant])],
  
})
export class ProductVariantsModule {}
