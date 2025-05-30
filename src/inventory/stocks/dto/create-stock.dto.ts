
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GstType } from 'src/enum/gst-types.enum';



export class VariantDto {
   @IsNumber()
  productId: number;

   @IsNumber()
  variantId: number;

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

  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;

  @IsNumber()
  totalAmount: number;

  @IsEnum(GstType)
  gstType: GstType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
