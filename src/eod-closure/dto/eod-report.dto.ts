import { IsISO8601, IsOptional } from 'class-validator';

export class EodReportDto {
  @IsISO8601()
  date: string;

}