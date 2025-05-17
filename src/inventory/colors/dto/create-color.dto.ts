import { IsNotEmpty } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  hexCode: string; // e.g., #FFFFFF
}