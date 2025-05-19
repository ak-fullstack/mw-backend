import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  typeId: number; // Referencing SizeType by ID
}