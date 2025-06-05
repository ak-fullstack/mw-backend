import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';
import { Payment } from 'src/order/payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string; // or customerId if users are stored

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ nullable: false })
  razorpayOrderId: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, payment => payment.order, { cascade: true })
  payments: Payment[];
}