import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StockPurchase } from 'src/inventory/stock-purchase/entities/stock-purchase.entity'; 
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';

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

  @Column('decimal', { precision: 10, scale: 2 })
  sp: number;

  @ManyToOne(() => StockPurchase, purchase => purchase.stocks, { onDelete: 'CASCADE' })
  purchase: StockPurchase;

  @Column('decimal', { precision: 10, scale: 2 })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  igst: number;

  

  @Column('decimal', { precision: 5, scale: 2, default: 0, name: 'discount_percent' })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2})
  ctc: number; 

  @Column({ default: 0 })
  reserved: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalTax: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  sgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  igstAmount: number;

  get available(): number {
  return this.quantity - this.used - this.reserved;
}
}
