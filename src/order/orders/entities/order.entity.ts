import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';
import { Payment } from 'src/order/payments/entities/payment.entity';
import { State } from 'src/enum/states.enum';
import { Customer } from 'src/customer/entities/customer.entity';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { OrderStatus } from 'src/enum/order-status.enum';
import { StockMovement } from 'src/inventory/stock-movements/entities/stock-movement.entity';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  orderStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: false, unique: true })
  razorpayOrderId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  successfulPaymentId: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalDiscount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  paidAmount: number;

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

  @Column({ type: 'varchar', length: 100, nullable: true, default: 'India' })
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

  @Column({ type: 'varchar', length: 100, nullable: true, default: 'India' })
  shippingCountry: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  packageLength: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  packageBreadth: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  packageHeight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  packageWeight: number;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.orders, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => Payment, payment => payment.order, { cascade: true })
  payments: Payment[];

  @OneToMany(() => StockMovement, (movement) => movement.order)
  stockMovements: StockMovement[];

  @Column({ type: 'int', nullable: true })
  replacementForOrderId: number;

  @ManyToOne(() => Order, order => order.replacementOrders) // 👈 reference reverse property
  @JoinColumn({ name: 'replacementForOrderId' })
  originalOrder: Order;

  // Reverse side: One order may have many replacements
  @OneToMany(() => Order, order => order.originalOrder)
  replacementOrders: Order[];

  @Column({ type: 'boolean', default: false })
  isReplacement: boolean;


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