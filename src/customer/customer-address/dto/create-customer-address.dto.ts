import { State } from 'src/enum/states.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCustomerAddressDto {

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(State)
  @IsNotEmpty()
  state: State;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  pincode: string;
}