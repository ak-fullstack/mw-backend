import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,JwtService],
   imports: [TypeOrmModule.forFeature([Customer])],
})
export class CustomerModule {}
