import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnItemCondition } from 'src/enum/return-item-condition.enum';

export class VerifyReturnItemDto {
  @IsInt()
  @IsNotEmpty()
  stockId: number;

  @IsInt()
  @IsNotEmpty()
  returnItemId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  itemCondition: ReturnItemCondition;
}

export class VerifyReturnItemsDto {
  @IsInt()
  @IsNotEmpty()
  returnId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifyReturnItemDto)
  items: VerifyReturnItemDto[];
}
