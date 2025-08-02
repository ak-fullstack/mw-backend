import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_settings')
export class OrderSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json', nullable: false })
    settings: { [key: string]: any };
}