import { IsString, IsEmail } from 'class-validator';

export class GenerateOtpDto {
  @IsEmail()  // Validates that it's a valid email format
  email: string;
}
