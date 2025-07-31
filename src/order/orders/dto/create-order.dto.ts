import { Type } from 'class-transformer';
import {IsString,IsNotEmpty,IsEmail,Matches,Length,IsBoolean,IsArray,ValidateNested,IsOptional,IsNumber} from 'class-validator';
import { State } from 'src/enum/states.enum';

export class OrderItemDto {
  @IsNumber()
  stockId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingName: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  shippingPhoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  shippingEmailId: string;

  @IsNumber()
  shippingAddressId: number;

  @IsNumber()
  billingAddressId: number;

  @IsBoolean()
  billingSameAsShipping: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingState?: State;

  @IsString()
  @IsNotEmpty()
  paymentSource: string;

}