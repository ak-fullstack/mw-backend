import { Module } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { WalletTransactionController } from './wallet-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransaction } from './entities/wallet-transaction.entity';

@Module({
  controllers: [WalletTransactionController],
  providers: [WalletTransactionService],
  exports: [WalletTransactionService],
  imports: [TypeOrmModule.forFeature([WalletTransaction])], // Add your WalletTransaction entity here if needed
})
export class WalletTransactionModule {}
