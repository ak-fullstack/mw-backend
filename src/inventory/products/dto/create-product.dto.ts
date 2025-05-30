import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';


export class CategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class SubCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}

export class VariantDto {
  @IsString()
  sku: string;

  @IsOptional()
  @IsObject()
  color?: any;

  @IsOptional()
  @IsObject()
  size?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ValidateNested()
  @Type(() => SubCategoryDto)
  subCategory: SubCategoryDto;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productDescription: string;

  @IsBoolean()
  hasSize: boolean;

  @IsBoolean()
  hasColor: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
