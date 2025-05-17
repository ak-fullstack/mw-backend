import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ColorsModule } from './colors/colors.module';
import { SizeTypesModule } from './size-types/size-types.module';
import { SizesModule } from './sizes/sizes.module';
import { DimensionsModule } from './dimensions/dimensions.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { StockPurchaseModule } from './stock-purchase/stock-purchase.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [ProductsModule, CategoryModule, SubcategoryModule, ColorsModule, SizeTypesModule, SizesModule, DimensionsModule, ProductVariantsModule, ProductImagesModule, StockPurchaseModule, StocksModule],
})
export class InventoryModule {}
