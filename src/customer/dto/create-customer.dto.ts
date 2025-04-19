import { IsNotEmpty, IsEmail, IsString, IsOptional, IsEnum, IsInt, Matches, MinLength } from 'class-validator';
import { State } from 'src/enum/states.enum';

export class CreateCustomerDto {

    

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character.'
      })
    password: string;


    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    streetAddress?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?: string;

    @IsEnum(State)
    @IsOptional()
    state?: State;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{6}$/, { message: 'Pincode must be exactly 6 digits' })
    pincode?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' })
    phoneNumber: string;

}
