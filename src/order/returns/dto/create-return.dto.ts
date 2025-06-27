import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";

class ReturnItemDto {
  @IsInt()
  orderItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class CreateReturnDto {
  @IsInt()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];
}