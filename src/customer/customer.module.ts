import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { CustomerAddressModule } from './customer-address/customer-address.module';
import { CustomerAddress } from './customer-address/entities/customer-address.entity';
import { WalletModule } from './wallet/wallet.module';
import { WalletTransactionModule } from './wallet-transaction/wallet-transaction.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,JwtService],
   imports: [TypeOrmModule.forFeature([Customer,CustomerAddress]), CustomerAddressModule, WalletModule, WalletTransactionModule],
})
export class CustomerModule {}
