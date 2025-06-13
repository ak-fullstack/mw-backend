import { Order } from "src/order/orders/entities/order.entity";
import { Refund } from "src/order/refunds/entities/refund.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  razorpayPaymentId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'varchar', length: 50, default: 'created' })
  status: string;

  @ManyToOne(() => Order, order => order.payments)
  order: Order;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: string;

  @OneToMany(() => Refund, refund => refund.payment)
  refunds: Refund[];

  @CreateDateColumn()
  createdAt: Date;

   @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
}
