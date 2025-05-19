import { IsString, Length } from 'class-validator';

export class CreateSizeTypeDto {
  @IsString()
  @Length(1, 50)
  name: string;
}