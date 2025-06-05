import { Module } from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { CustomerAddressController } from './customer-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddress } from './entities/customer-address.entity';
import { Customer } from '../entities/customer.entity';

@Module({
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService],
  imports: [TypeOrmModule.forFeature([CustomerAddress,Customer])],
})
export class CustomerAddressModule {}
