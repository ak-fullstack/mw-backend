import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/order/orders/entities/order.entity';
import { ShiprocketStatusLog } from 'src/shiprocket/shiprocket-status-log/entities/shiprocket-status-log.entity';

@Entity('shiprocket_shipments')
export class ShiprocketShipment {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => Order, order => order.shipments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'enum', enum: ['forward', 'return'] })
  type: 'forward' | 'return';

  @Column({ nullable: true })
  shiprocketOrderId: string;

  @Column({ nullable: true })
  shipRocketShipmentId: string;

  @Column({ nullable: true })
  awbCode: string;

  @Column({ nullable: true })
  pickupId: string;

  @Column({ nullable: true })
  courierCompany: string;

  @Column({ nullable: true })
  shipmentStatus: string;

  @Column({ type: 'text', nullable: true })
  trackingUrl: string;

  @Column({ type: 'text', nullable: true })
  shippingLabelUrl: string;

  @Column({ type: 'text', nullable: true })
  manifestUrl: string;

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

  @OneToMany(() => ShiprocketStatusLog, log => log.shipment)
  statusLogs: ShiprocketStatusLog[];
}