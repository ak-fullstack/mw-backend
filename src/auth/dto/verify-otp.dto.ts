import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;

  @IsOptional()
  purpose:string
}
