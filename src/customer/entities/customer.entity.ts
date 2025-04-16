import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({ type: 'text', name: 'street', nullable: true })
    streetAddress: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    pincode: string;

    @Column({
        length: 255,
        generatedType: 'STORED', // Store it in the DB
        asExpression: "CONCAT(street, ', ', city, ', ', state, ', ', pincode)",
        nullable: true
    })
    fullAddress: string;

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
    @Column({ type: 'varchar', length: 20, default: 'FAM_MEMBER' })
    role: string;

    @Column({ length: 255, nullable: true })
    profileImageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


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