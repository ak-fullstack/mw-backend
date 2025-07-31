import { IsNotEmpty } from "class-validator";
import { StockStage } from "src/enum/stock-stages.enum";
import { Stock } from "src/inventory/stocks/entities/stock.entity";
import { OrderItem } from "src/order/order-items/entities/order-item.entity";
import { Order } from "src/order/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stock, { nullable: false, eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  @ManyToOne(() => OrderItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderItemId' })
  orderItem?: OrderItem;

  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: StockStage, nullable: true })
  from: StockStage;

  @Column({ type: 'enum', enum: StockStage })
  to: StockStage;

  @Column({ nullable: true })
  movedBy: string;

  @Column({ nullable: true })
  remarks: string;


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
}
