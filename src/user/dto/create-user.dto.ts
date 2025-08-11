import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsPhoneNumber, Length, IsNotEmpty, IsUrl, Matches } from 'class-validator';
import { State } from 'src/enum/states.enum';
import { UserStatus } from 'src/enum/user-staus.enum';

export class CreateUserDto {

  // First Name
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  firstName: string;

  // Last Name
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  lastName: string;

  // Email
  @IsEmail()
  @Length(1, 100)
  @IsNotEmpty()
  email: string;

  // Phone (Optional, with a max length constraint)
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' })
  phone: string;

  // Role ID (The role should exist in the database already)
  @IsNotEmpty()
  roleId: number;



  // Street Address
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  streetAddress: string;

  // City
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  city: string;

  // State (Enum)
  @IsEnum(State)
  @IsOptional()
  state: State;

  // Pincode
  @IsString()
  @Length(1, 10)
  @IsNotEmpty()
  pincode: string;

  // Profile Image URL (Optional, for the image uploaded URL)
  // @IsOptional()
  // @IsUrl()
  // @Length(1, 255)
  // profileImageUrl: string;

  @IsOptional()
  @Length(1, 255)
  profileImageUrl?: string;
}
