import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { GstType } from 'src/enum/gst-types.enum';
import { Supplier } from 'src/order/suppliers/entities/supplier.entity';



@Entity('stock_purchases')
export class StockPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billRefNo: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

 @ManyToOne(() => Supplier, supplier => supplier.stockPurchases)
  supplier: Supplier;

  @Column({ type: 'timestamp' })
  purchaseDate: Date;

   @Column({
    type: 'enum',
    enum: GstType,
  })
  gstType: GstType;

  @OneToMany(() => Stock, stock => stock.purchase)
  stocks: Stock[];
}
