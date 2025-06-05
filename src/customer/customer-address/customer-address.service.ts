import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { CustomerAddress } from './entities/customer-address.entity';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerAddressService {

  constructor(    @InjectRepository(CustomerAddress)
    private readonly addressRepo: Repository<CustomerAddress>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>){

  }


 async addAddress(customerId: number, createCustomerAddressDto: CreateCustomerAddressDto): Promise<any> {
  const existingAddresses = await this.addressRepo.find({ where: { customerId } });

  if (existingAddresses.length >= 2) {
    throw new BadRequestException('Maximum 2 addresses allowed per customer.');
  }

  const newAddress = this.addressRepo.create({ ...createCustomerAddressDto, customerId });
  const savedAddress = await this.addressRepo.save(newAddress);

  const customer = await this.customerRepo.findOne({ where: { id: customerId } });
  if (!customer) throw new NotFoundException('Customer not found');

  if (!customer.billingAddressId || !customer.shippingAddressId) {
    customer.billingAddressId = savedAddress.id;
    customer.shippingAddressId = savedAddress.id;
    await this.customerRepo.save(customer);
  }

  return savedAddress;
}

  findAll() {
    return `This action returns all customerAddress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerAddress`;
  }

  update(id: number, updateCustomerAddressDto: UpdateCustomerAddressDto) {
    return `This action updates a #${id} customerAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerAddress`;
  }
}
