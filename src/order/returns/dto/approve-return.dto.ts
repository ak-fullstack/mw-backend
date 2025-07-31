import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsArray, ValidateNested } from 'class-validator';
import { ReturnResolutionMethod } from 'src/enum/resolution-method.enum';
import { ReturnItemStatus } from 'src/enum/return-items-status.enum';
import { ReturnStatus } from 'src/enum/return-status.enum';


export class ApproveReturnItemDto {
  @IsInt()
  returnItemId: number;

  @IsEnum(ReturnResolutionMethod)
  action: ReturnResolutionMethod;
}

export class ApproveReturnDto {
  @IsInt()
  returnId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApproveReturnItemDto)
  items: ApproveReturnItemDto[];
}