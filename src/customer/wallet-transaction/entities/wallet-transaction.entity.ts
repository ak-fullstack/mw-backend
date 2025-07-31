import { Wallet } from "src/customer/wallet/entities/wallet.entity";
import { WalletTransactionType } from "src/enum/wallet-transaction-type.enum";
import { Order } from "src/order/orders/entities/order.entity";
import { Return } from "src/order/returns/entities/return.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum WalletTransactionReason {
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  ORDER_REFUND = 'ORDER_REFUND',
  RETURN_REFUND = 'RETURN_REFUND',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
  CASHBACK = 'CASHBACK',
  WALLET_TOPUP = 'WALLET_TOPUP',
}


@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn()
  wallet: Wallet;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: WalletTransactionReason })
  reason: WalletTransactionReason;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Order, order => order.walletTransactions, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Return, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  returnRequest: Return;

  @Column({ type: 'enum', enum: WalletTransactionType })
  transactionType: WalletTransactionType;


  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}