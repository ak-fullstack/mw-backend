import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class ReturnItemDto {
  @IsInt()
  orderItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  images: string[]; // now required
}

export class CreateReturnDto {
  @IsInt()
  orderId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];
}