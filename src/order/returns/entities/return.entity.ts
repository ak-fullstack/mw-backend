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
import { ReturnType } from 'src/enum/return-type.enum';
import { ReturnStatus } from 'src/enum/return-status.enum';
import { ReturnImage } from '../return-images/entities/return-image.entity';

@Entity('returns')
export class Return {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ type: 'enum', enum: ReturnStatus, default: ReturnStatus.RETURN_REQUESTED })
    returnStatus: ReturnStatus;

    @Column({
        type: 'enum',
        enum: ReturnType,
        default: ReturnType.REPLACEMENT,
    })
    returnType: ReturnType;

    @OneToMany(() => ReturnItem, item => item.returnRequest, { cascade: false })
    items: ReturnItem[];

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

    @Column({
        type: 'timestamp', 
        nullable: true,
    })
    processedDate: Date;


    @OneToMany(() => ReturnImage, (image) => image.return, {
        cascade: false,
    })
    images: ReturnImage[];
}
