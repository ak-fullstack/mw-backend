import { Order } from "src/order/orders/entities/order.entity";
import { Refund } from "src/order/refunds/entities/refund.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razorpayOrderId: string;

  @Column()
  razorpayPaymentId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ default: false })
  paid: boolean;

  @Column({ nullable: true })
  razorpaySignature: string;

  @ManyToOne(() => Order, order => order.payments)
  order: Order;

  @OneToMany(() => Refund, refund => refund.payment)
  refunds: Refund[];

  @CreateDateColumn()
  createdAt: Date;
}
