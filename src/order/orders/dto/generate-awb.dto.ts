import { IsNumber, IsString } from 'class-validator';

export class GenerateAwbDto {
  @IsString()
  courierCompanyId: string;

  @IsNumber()
  orderId: number;
}