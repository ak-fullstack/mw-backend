import { Controller, Get, Post, Body, Headers, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { State } from 'src/enum/states.enum';  // Assuming you have an enum for states
import { Roles } from 'src/decorators/roles.decorator';


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Post('create-customer')
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Headers('authorization') authHeader: string
  ): Promise<any> {
    const token = authHeader?.replace('Bearer ', '');
    return this.customerService.create(createCustomerDto, token);
  }

  @Post('update-customer')
  async updateCustomerPassword(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Headers('authorization') authHeader: string
  ): Promise<any> {
    const token = authHeader?.replace('Bearer ', '');
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
