import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShiprocketShipment } from 'src/shiprocket/shiprocket-shipments/entities/shiprocket-shipment.entity'; 

@Entity('shiprocket_status_logs')
export class ShiprocketStatusLog {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => ShiprocketShipment, shipment => shipment.statusLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipmentId' })
  shipment: ShiprocketShipment;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

}
  