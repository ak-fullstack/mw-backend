import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { State } from 'src/enum/states.enum';
import { CustomerAddress } from '../customer-address/entities/customer-address.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  FAM_MEMBER = 'FAM_MEMBER',
  GUEST = 'GUEST',
}

@Entity('customers')
// @Unique(["motoFamId"])  // Ensure motoFamId is unique
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ length: 101, generatedType: 'STORED', asExpression: "CONCAT(firstName, ' ', lastName)", nullable: true })
  fullName: string;


  @Column({ type: 'varchar', length: 10, unique: true, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, unique: true, })
  emailId: string; // Optional

  // motoFamId with MF_ prefix and auto-increment
  //   @Column({ type: 'varchar', length: 10, unique: true })
  //   motoFamId: string;

  // status field - can be active, blocked, etc.
  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: 'ACTIVE' | 'BLOCKED' | 'INACTIVE';

  // role is a fixed value "FAM_MEMBER"
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FAM_MEMBER,
  })
  role: UserRole;

  @Column({ length: 255, nullable: true })
  profileImageUrl: string;

  @OneToMany(() => CustomerAddress, (address) => address.customer, { cascade: true, eager: true })
  addresses: CustomerAddress[];

  @OneToOne(() => CustomerAddress, { nullable: true, eager: true })
  @JoinColumn({ name: 'billingAddressId' })
  billingAddress: CustomerAddress;

  @OneToOne(() => CustomerAddress, { nullable: true, eager: true })
  @JoinColumn({ name: 'shippingAddressId' })
  shippingAddress: CustomerAddress;

  @Column({ nullable: true })
  billingAddressId: number;

  @Column({ nullable: true })
  shippingAddressId: number;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ select: false, nullable: true })
  @Exclude()
  passwordHash: string;

  async comparePassword(inputPassword: string): Promise<boolean> {

    if (!this.passwordHash) {
      return false;
    }

    return await bcrypt.compare(inputPassword, this.passwordHash);
  }

  // Method to set password (used when creating/updating the password)
  async setPassword(plainPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.passwordHash = await bcrypt.hash(plainPassword, salt); // Set the hashed password
  }
  //   // Automatically generate motoFamId before inserting
  //   @BeforeInsert()
  //   generateMotoFamId() {
  //     // Find the max id from the table (you may need to handle concurrency)
  //     // You might want to optimize this with a query to avoid race conditions
  //     const prefix = 'MF_';
  //     // Logic to generate incremental motoFamId (for example: MF_1, MF_2, etc.)
  //     // This logic assumes you want to generate based on the last motoFamId
  //     // For production, it's better to handle this using a custom sequence in the DB

  //     // You can query for the latest motoFamId, extract the number and increment it
  //     // This is just an example logic - be cautious in production for concurrency issues
  //     // Example: get the latest motoFamId and increment the number
  //     this.motoFamId = `${prefix}${Math.floor(Math.random() * 1000) + 1}`;
  //   }
}