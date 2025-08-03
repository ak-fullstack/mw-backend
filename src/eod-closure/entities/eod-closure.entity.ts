import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class EodClosure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default: 0 })
    orderCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalOrderValue: number;

    @Column({ type: 'int', default: 0 })
    returnCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalReturnValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalDiscount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    cgst: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    sgst: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    igst: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    netRevenue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    refundAmount: number;

    @Column({ type: 'json', nullable: true })
    paymentMethods: Record<string, number>;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    closureTime: Date;

    @Column({ type: 'date', unique: true })
    closureDate: Date;

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