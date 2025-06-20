import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { StockStage } from 'src/enum/stock-stages.enum';

export class CreateStockMovementDto {
  @IsNumber()
  stockId: number;

  @IsInt()
  quantity: number;

  @IsEnum(StockStage)
  to: StockStage;

  @IsEnum(StockStage)
  from: StockStage;

   @IsOptional()
  @IsInt()
  orderItemId?: number;

  @IsOptional()
  @IsInt()
  orderId?: number;

  @IsOptional()
  movedBy?: string;

  @IsOptional()
  remarks?: string;
}