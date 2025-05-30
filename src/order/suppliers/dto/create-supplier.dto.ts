import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsPhoneNumber('IN') // Adjust based on your locale
  @IsOptional()
  @MaxLength(15)
  phone?: string;

  @IsString()
  @IsOptional()
  @Length(15, 15)
  @Transform(({ value }) => value?.toUpperCase())
  gstNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
