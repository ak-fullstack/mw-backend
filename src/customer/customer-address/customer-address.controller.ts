import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { State } from 'src/enum/states.enum';

@Controller('customer-address')
export class CustomerAddressController {
  constructor(private readonly customerAddressService: CustomerAddressService) { }

  @Get('get-all-states')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FAM_MEMBER')
  getAllStates(): string[] {
    return Object.values(State);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FAM_MEMBER')
  async addAddress(@Req() req, @Body() dto: CreateCustomerAddressDto) {
    const customerId = req.user.userId; 

    if (!customerId) {
      throw new BadRequestException('Invalid token: no customer ID found');
    }

    return this.customerAddressService.addAddress(customerId, dto);
  }

  @Get()
  findAll() {
    return this.customerAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerAddressService.findOne(+id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FAM_MEMBER')
  async updateAddress(
    @Body() updateDto: UpdateCustomerAddressDto,
    @Req() req: any,
  ) {
    const customerId = req.user.userId;
    return await this.customerAddressService.updateAddressIfOwned(customerId, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerAddressService.remove(+id);
  }


}
