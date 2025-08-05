import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';
import { Payment } from 'src/order/payments/entities/payment.entity';
import { State } from 'src/enum/states.enum';
import { Customer } from 'src/customer/entities/customer.entity';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { OrderStatus } from 'src/enum/order-status.enum';
import { StockMovement } from 'src/inventory/stock-movements/entities/stock-movement.entity';
import { Return } from 'src/order/returns/entities/return.entity';
import { WalletTransaction } from 'src/customer/wallet-transaction/entities/wallet-transaction.entity';
import { DecimalToNumber } from 'src/common/transformers/decimal-transformer';
import { ShiprocketShipment } from 'src/shiprocket/shiprocket-shipments/entities/shiprocket-shipment.entity';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => Customer, customer => customer.orders, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

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

  @Column({ nullable: true, unique: true })
  razorpayOrderId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  successfulPaymentId: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: false })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  totalDiscount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, transformer: DecimalToNumber })
  paidAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  deliveryCharge: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  totalTax: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  originalSubtotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  totalDeliveryTax: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  totalItemTax: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  billingFirstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  billingLastName: string;

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
  shippingFirstName: string;

   @Column({ type: 'varchar', length: 50, nullable: true })
  shippingLastName: string;

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

  @OneToMany(() => ShiprocketShipment, shipment => shipment.order)
  shipments: ShiprocketShipment[];

  @OneToMany(() => Payment, payment => payment.order, { cascade: false })
  payments: Payment[];

  @OneToMany(() => StockMovement, (movement) => movement.order)
  stockMovements: StockMovement[];

  @Column({ type: 'int', nullable: true })
  replacementForOrderId: number;

  @ManyToOne(() => Order, order => order.replacementOrders) // 👈 reference reverse property
  @JoinColumn({ name: 'replacementForOrderId' })
  originalOrder: Order;

  @OneToMany(() => Order, order => order.originalOrder)
  replacementOrders: Order[];

  @Column({ type: 'boolean', default: false })
  isReplacement: boolean;

  @Column({ default: false })
  hasReturn: boolean;

  @OneToMany(() => Return, (returnRequest) => returnRequest.order)
  returns: Return[];

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;

  @Column({
    type: 'enum',
    enum: ['wallet', 'razorpay', 'wallet+razorpay', 'none'],
    default: 'razorpay',
  })
  paymentSource: 'wallet' | 'razorpay' | 'wallet+razorpay' | 'none';

  @Column({ type: 'boolean', default: false })
  usedWallet: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: DecimalToNumber })
  walletAmountUsed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: DecimalToNumber })
  razorpayAmountPaid: number;

  @Column({ type: 'boolean', default: false })
  isZeroPayment: boolean; // For replacement orders or free offers

  @OneToMany(() => WalletTransaction, tx => tx.order)
  walletTransactions: WalletTransaction[];


  get fullBillingAddress(): string {
    const parts = [
      this.billingFirstName+ ' ' + this.billingLastName,
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
      this.shippingFirstName + ' ' + this.shippingLastName,
      this.shippingStreetAddress,
      this.shippingCity,
      this.shippingState,
      this.shippingPincode,
      this.shippingCountry
    ].filter(Boolean);
    return parts.join(', ');
  }
}