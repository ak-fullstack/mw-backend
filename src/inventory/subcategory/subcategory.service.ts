import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
   const category = await this.categoryRepository.findOne({ where: { id: createSubcategoryDto.categoryId } });
if (!category) {
  throw new NotFoundException(`Category with id ${createSubcategoryDto.categoryId} not found`);
}

const subcategory = this.subcategoryRepository.create({
  name: createSubcategoryDto.name,
  category: category,
});

return await this.subcategoryRepository.save(subcategory);
  }

  async findAll(): Promise<Subcategory[]> {
    const subcategories = await this.subcategoryRepository.find({ relations: ['category'] });
    if (subcategories.length === 0) {
      throw new NotFoundException('No subcategories found');
    }
    return subcategories;
  }

  async findOne(id: number): Promise<any> {
   const subcategories = await this.subcategoryRepository.find({
    where: {
      category: { id: id },
    },
    relations: ['category'],
  });

  if (!subcategories.length) {
    throw new NotFoundException(`No subcategories found for this category`);
  }

  return subcategories;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
    const subcategory = await this.findOne(id);
    Object.assign(subcategory, updateSubcategoryDto);
    return await this.subcategoryRepository.save(subcategory);
  }

  async remove(id: number): Promise<void> {
    const subcategory = await this.findOne(id);
    await this.subcategoryRepository.remove(subcategory);
  }
}

