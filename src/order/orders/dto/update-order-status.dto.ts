// update-order-status.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { OrderStatus } from 'src/enum/order-status.enum';


export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  newStatus?: OrderStatus;

  @IsOptional()
  @IsString()
  movedBy?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
