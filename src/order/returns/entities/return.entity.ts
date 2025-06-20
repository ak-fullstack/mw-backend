import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Order } from 'src/order/orders/entities/order.entity'; 
import { ReturnItem } from 'src/order/return-items/entities/return-item.entity'; 

@Entity('returns')
export class Return {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: number;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], default: 'PENDING' })
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

    @OneToMany(() => ReturnItem, item => item.returnRequest, { cascade: true })
    items: ReturnItem[];

    @CreateDateColumn()
    createdAt: Date;
}
