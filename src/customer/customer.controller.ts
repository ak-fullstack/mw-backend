import { Controller, Get, Post, Body,Headers, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}


  @Post('create-customer')
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Headers('authorization') authHeader: string
): Promise<Customer> {
    const token = authHeader?.replace('Bearer ', '');
    return this.customerService.create(createCustomerDto, token);
  }

}
