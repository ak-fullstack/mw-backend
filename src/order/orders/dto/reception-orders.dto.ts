import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FindReceptionOrdersQueryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  razorpayOrderId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumberString()
  page: string = '1'; // string from query, will be parsed later

  @IsOptional()
  @IsNumberString()
  limit: string = '10';
}