import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { StockPurchase } from 'src/inventory/stock-purchase/entities/stock-purchase.entity';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';
import { DecimalToNumber } from 'src/common/transformers/decimal-transformer';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  used: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  sp: number;

  @ManyToOne(() => StockPurchase, purchase => purchase.stocks, { onDelete: 'CASCADE' })
  purchase: StockPurchase;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  igst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, name: 'discount_percent', transformer: DecimalToNumber })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  ctc: number;

  @Column({ default: 0 })
  reserved: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  totalTax: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  cgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  sgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  igstAmount: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  onSale: boolean;

  get available(): number {
    return this.quantity - this.used - this.reserved;
  }
}
