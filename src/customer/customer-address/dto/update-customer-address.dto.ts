import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerAddressDto } from './create-customer-address.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCustomerAddressDto extends PartialType(CreateCustomerAddressDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
