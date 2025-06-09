import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';
import { Payment } from 'src/order/payments/entities/payment.entity';
import { State } from 'src/enum/states.enum';
import { Customer } from 'src/customer/entities/customer.entity';
import { PaymentStatus } from 'src/enum/payment-status.enum';

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

  @ManyToOne(() => Customer, customer => customer.orders, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: number; // FK column to customer table

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: false,unique:true })
  razorpayOrderId: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalDiscount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalTax: number;

   @Column({ type: 'varchar', length: 50, nullable: true })
  billingName: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  billingPhoneNumber: string;

  @Column({ type: 'varchar', length: 100 })
  billingEmailId: string;


  @Column({ type: 'text', nullable: true })
  billingStreetAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  billingCity: string;

  @Column({ type: 'enum', enum: State, nullable: true })
  billingState: State;

  @Column({ type: 'varchar', length: 6, nullable: true })
  billingPincode: string;

  @Column({ type: 'varchar', length: 100, nullable: true,default:'India' })
  billingCountry: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shippingName: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  shippingPhoneNumber: string;

  @Column({ type: 'varchar', length: 100 })
  shippingEmailId: string;

  @Column({ type: 'text', nullable: true })
  shippingStreetAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shippingCity: string;

  @Column({ type: 'enum', enum: State, nullable: true })
  shippingState: State;

  @Column({ type: 'varchar', length: 6, nullable: true })
  shippingPincode: string;

  @Column({ type: 'varchar', length: 100, nullable: true,default:'India' })
  shippingCountry: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, payment => payment.order, { cascade: true })
  payments: Payment[];

  get fullBillingAddress(): string {
  const parts = [
    this.billingName,
    this.billingStreetAddress,
    this.billingCity,
    this.billingState,
    this.billingPincode,
    this.billingCountry
  ].filter(Boolean);
  return parts.join(', ');
}

get fullShippingAddress(): string {
  const parts = [
    this.shippingName,
    this.shippingStreetAddress,
    this.shippingCity,
    this.shippingState,
    this.shippingPincode,
    this.shippingCountry
  ].filter(Boolean);
  return parts.join(', ');
}
}