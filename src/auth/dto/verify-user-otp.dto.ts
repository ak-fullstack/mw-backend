import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyUserOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  token: string;

  @IsOptional()
  purpose:string
}