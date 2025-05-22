import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';

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

  @Column()
  supplierName: string;

  @Column({ type: 'timestamp' })
  purchaseDate: Date;

  @OneToMany(() => Stock, stock => stock.purchase)
  stocks: Stock[];
}
