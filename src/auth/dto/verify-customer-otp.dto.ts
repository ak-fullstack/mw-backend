import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyCustomerOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;

  @IsOptional()
  purpose:string
}
