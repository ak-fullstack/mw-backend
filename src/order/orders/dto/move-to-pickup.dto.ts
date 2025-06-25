// move-to-pickup.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateOrderStatusDto } from './update-order-status.dto';

export class MoveToPickupDto extends UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  length: number;

  @IsNumber()
  @IsNotEmpty()
  breadth: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  weight: number;
}