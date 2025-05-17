import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  imports: [TypeOrmModule.forFeature([Subcategory,Category])],
  
})
export class SubcategoryModule {}
