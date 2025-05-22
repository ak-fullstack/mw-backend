
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';



export class VariantDto {
   @IsNumber()
  productId: number;

   @IsNumber()
  variantId: number;

  @IsString()
  sku: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  ctc: number;

  @IsNumber()
  mrp: number;

  @IsNumber()
  sp: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  cgst: number;

  @IsNumber()
  sgst: number;

  @IsNumber()
  igst: number;
}



export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  billRefNo: string;

  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
