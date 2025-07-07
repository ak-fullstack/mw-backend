// update-order-status.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ReturnStatus } from 'src/enum/return-status.enum';


export class UpdateReturnStatusDto {
  @IsNumber()
  @IsNotEmpty()
  returnId: number;

  @IsEnum(ReturnStatus)
  @IsOptional()
  newStatus?: ReturnStatus;

  @IsOptional()
  @IsString()
  movedBy?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
