import { Injectable } from '@nestjs/common';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';

@Injectable()
export class WalletTransactionService {
  

  createWalletTransaction(createWalletTransactionDto: CreateWalletTransactionDto) {
    // Logic to create a wallet transaction
    return 'This action adds a new walletTransaction';
  }
}
