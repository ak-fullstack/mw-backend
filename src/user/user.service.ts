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

}
