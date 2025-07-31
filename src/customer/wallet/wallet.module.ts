import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletTransactionModule } from '../wallet-transaction/wallet-transaction.module';
import { WalletTransaction } from '../wallet-transaction/entities/wallet-transaction.entity';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
  imports:[TypeOrmModule.forFeature([Wallet,WalletTransaction])], // Add your Wallet entity here
})
export class WalletModule {}
