import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
