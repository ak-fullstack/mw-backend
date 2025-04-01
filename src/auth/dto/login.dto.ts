import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()  // Validates that it's a valid email format
  email: string;

  @IsString()  // Validates that the password is a string
  password: string;
}
