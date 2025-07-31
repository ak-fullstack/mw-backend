import { IsString, IsDateString, IsObject, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  selectedOrderKeys: Record<string, boolean>;

  @IsArray()
  selectedOrderItemKeys: Record<string, boolean>;

  @IsArray()
  selectedReturnKeys: Record<string, boolean>;

  @IsArray()
  selectedReturnItemKeys: Record<string, boolean>;
}