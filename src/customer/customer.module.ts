import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { CustomerAddressModule } from './customer-address/customer-address.module';
import { CustomerAddress } from './customer-address/entities/customer-address.entity';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,JwtService],
   imports: [TypeOrmModule.forFeature([Customer,CustomerAddress]), CustomerAddressModule],
})
export class CustomerModule {}
