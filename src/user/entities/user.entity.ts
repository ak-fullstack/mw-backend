import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Role } from 'src/roles/role/entities/role.entity';
import { State } from 'src/enum/states.enum';
import { UserStatus } from 'src/enum/user-staus.enum'; 
// import { UserImage } from './user-image.entity';



@Entity('users')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 101, generatedType: 'STORED', asExpression: "CONCAT(firstName, ' ', lastName)" })
    fullName: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 10 })
    phone: string;

   

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users, {
      eager: true,
      onDelete: 'SET NULL',
      nullable: true,
    })
    @JoinColumn({ name: 'roleId' })
    role: Role;
    

    @Column({nullable: true})
    roleId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    // Address-related fields
    @Column({ length: 255 })
    streetAddress: string;

    @Column({ length: 100 })
    city: string;

    @Column({ type: 'enum', enum: State, default: State.TAMIL_NADU })
    state: State;  // State now uses the enum defined above

    @Column({ length: 10})
    pincode: string;

    // Profile image URL
    @Column({ length: 255 })
    profileImageUrl: string;

    // Computed full address based on the fields above
    @Column({ length: 512, nullable: true })
    fullAddress: string;
    
    @BeforeInsert()
    @BeforeUpdate()
    setFullAddress() {
      this.fullAddress = `${this.streetAddress || ''}, ${this.city || ''}, ${this.state || ''}, ${this.pincode || ''}`;
    }


    @Column({ select: false,nullable: true })
    @Exclude()
    passwordHash: string;

    // Compare password method
    async comparePassword(inputPassword: string): Promise<boolean> {
        return inputPassword === this.passwordHash;
    }
}