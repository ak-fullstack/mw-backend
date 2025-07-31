import { Customer } from "src/customer/entities/customer.entity";
import { State } from "src/enum/states.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  streetAddress: string;

  @Column({
    length: 255,
    generatedType: 'STORED',
    asExpression: "CONCAT(streetAddress, ', ', city, ', ', state, ', ', country, ', ', pincode)",
    nullable: true,
  })
  fullAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'enum', enum: State, nullable: true })
  state: State;

  @Column({ type: 'varchar', length: 6, nullable: true })
  pincode: string;

  @Column({ type: 'varchar', length: 6, default: 'India' })
  country: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: number;

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