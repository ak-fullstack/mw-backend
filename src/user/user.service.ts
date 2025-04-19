import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User> 
    ) {}
  


    async findByUserEmail(email: string): Promise<any> {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .where('user.email = :email', { email })
        .select([
          'user.id',
          'user.email',
          'role.roleName',
          'permission.permission',
        ])
        .getOne();
    
      if (!user) return null;
    
      return {
        id: user.id,
        email: user.email,
        role: {
          roleName: user.role.roleName,
          permissions: user.role.permissions.map((p) => p.permission),
        },
      };
    }



    async create(createUserDto: CreateUserDto): Promise<User> {
      const user = this.userRepository.create(createUserDto); // Create the user entity
      return this.userRepository.save(user); // Save it to the database
    }

    async getAllUsers() {
  const users = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role') // Join the role table
    .leftJoinAndSelect('role.permissions', 'permissions') // Join the permissions table
    .select([
      'user.id',
      'user.fullName',
      'user.email',
      'user.phone',
      'user.fullAddress',
      'user.profileImageUrl',
      'user.createdAt',
      'role.roleName',
      'permissions.permission', // Select only the permissions
    ])
    .where('role.roleName != :superadmin', { superadmin: 'SUPER_ADMIN' })
    .getMany();
      
      return users.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role?.roleName,
        permissions: user.role?.permissions.map((perm) => perm.permission),
        phone: user.phone,
        address: user.fullAddress,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
      })); 
    }

}
