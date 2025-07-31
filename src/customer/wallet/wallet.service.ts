import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { WalletTransaction, WalletTransactionReason } from '../wallet-transaction/entities/wallet-transaction.entity';
import { WalletTransactionType } from 'src/enum/wallet-transaction-type.enum';

@Injectable()
export class WalletService {

  constructor(@InjectRepository(Wallet)
  private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
  ) {

  }

  async createWalletForCustomer(customerId: number): Promise<Wallet> {
    const existing = await this.walletRepository.findOne({
      where: { customer: { id: customerId } },
    });
    if (existing) return existing;

    const wallet = this.walletRepository.create({ customer: { id: customerId } });
    return await this.walletRepository.save(wallet);
  }

  async refundToWallet(walletId: number, amount: number, manager: EntityManager): Promise<void> {
    // Get the wallet by ID using manager
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      relations: ['customer'],
    });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Add the refund amount to the wallet balance
    wallet.balance = Number(wallet.balance) + Number(amount);

    // Save the updated wallet using manager
    await manager.save(Wallet, wallet);
  
    // Create and save the wallet transaction using manager
    const transaction = manager.create(WalletTransaction, {
      wallet,
      amount,
      reason: WalletTransactionReason.RETURN_REFUND,
      transactionType: WalletTransactionType.CREDIT,
    });
   try {
  await manager.save(WalletTransaction, transaction);
} catch (error) {
  console.error('Error saving WalletTransaction:', error);
  throw new InternalServerErrorException('Failed to save wallet transaction');
}

  }


  async getWalletByCustomerId(customerId: number): Promise<Wallet> {
  const wallet = await this.walletRepository.findOne({
    where: { customer: { id: customerId } },
  });

  if (!wallet) {
    throw new NotFoundException(`Wallet not found for customer ID ${customerId}`);
  }

  return wallet;
}


// wallet.service.ts
async debit(customerId: number,orderId:number,reason:WalletTransactionReason, amount: number, manager?: EntityManager): Promise<any> {
  const repo = manager?.getRepository(Wallet) || this.walletRepository;

  const wallet = await repo.findOne({
    where: { customer: { id: customerId } },
    lock: { mode: 'pessimistic_write' },
  });

  if (!wallet) {
    throw new NotFoundException(`Wallet not found for customer ID ${customerId}`);
  }

  if (wallet.balance < amount) {
    throw new BadRequestException('Insufficient wallet balance');
  }

  wallet.balance -= amount;
  await repo.save(wallet);

  const walletTransactionRepository = manager ? manager.getRepository(WalletTransaction) : this.walletTransactionRepository;
const transaction = walletTransactionRepository.create({
  wallet: { id: wallet.id },
  amount: -amount,
  transactionType: WalletTransactionType.DEBIT,
  reason,
  description: 'Order payment deduction',
  order: { id: orderId },
});

console.log(wallet.id,amount,reason,orderId);


try {
  return await walletTransactionRepository.save(transaction);
} catch (error) {
  console.error('Error while saving wallet transaction:', error);
  throw new InternalServerErrorException('Failed to save wallet transaction'); 
}}

}
