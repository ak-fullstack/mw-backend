import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class UpdateDiscountDto {
  @IsInt()
  stockId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountpercent: number;
}