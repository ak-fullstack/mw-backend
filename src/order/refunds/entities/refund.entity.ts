import { Payment } from "src/order/payments/entities/payment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razorpayRefundId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: 'initiated' })
  status: 'initiated' | 'processed' | 'failed';

  @ManyToOne(() => Payment, payment => payment.refunds)
  payment: Payment;

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
