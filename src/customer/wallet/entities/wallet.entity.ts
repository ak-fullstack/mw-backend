import { Customer } from "src/customer/entities/customer.entity";
import { WalletTransaction } from "src/customer/wallet-transaction/entities/wallet-transaction.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Customer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    balance: number;

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

    @OneToMany(() => WalletTransaction, tx => tx.wallet)
    transactions: WalletTransaction[];
}