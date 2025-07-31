import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';

@Controller('wallet-transaction')
export class WalletTransactionController {
  constructor(private readonly walletTransactionService: WalletTransactionService) {}

}
