import { Controller, Get, Post, Body, Headers, Request, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Post('create-customer')
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req
  ): Promise<any> {
    const token = req.cookies.access_token;
    console.log(token);
    return this.customerService.create(createCustomerDto, token);
  }

  @Post('update-customer')
  async updateCustomerPassword(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req
  ): Promise<any> {
    const token = req.cookies.access_token;
    return this.customerService.updateCustomer(updateCustomerDto, token);
  }

  @Get('get-all-customers')
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProfile(@Request() req) {
    const userId = req.user.userId;
    return this.customerService.getProfile(userId);
  }

  

}
