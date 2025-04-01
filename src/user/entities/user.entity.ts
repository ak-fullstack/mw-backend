import { Entity, PrimaryGeneratedColumn, Column, Index, Unique, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

// import { UserImage } from './user-image.entity';

export enum UserRole {
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
  }

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

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ select: false })
  @Exclude()
  passwordHash: string;

  @Column({ type: 'boolean', default: true }) 
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

//   @OneToMany(() => UserImage, (image) => image.user, { cascade: true })
//   images: UserImage[]; // User profile & cover images

  @CreateDateColumn()
  createdAt: Date; // Auto-handles creation timestamps

  @UpdateDateColumn()
  updatedAt: Date; // Auto-handles update timestamps


  async comparePassword(inputPassword: string): Promise<boolean> {    
    return inputPassword === this.passwordHash;
}
}
