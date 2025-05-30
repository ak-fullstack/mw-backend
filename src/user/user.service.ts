import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from 'src/enum/user-staus.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.setPassword('hello123')
  }

  async setPassword(plainPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    console.log(await bcrypt.hash(plainPassword, salt));

  }



  async findByUserEmail(email: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email })
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.status',
        'user.createdAt',
        'user.phone',
        'user.profileImageUrl',
        'role.roleName',
        'permission.permission',
      ])
      .getOne();

    if (!user) return null;

    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      status: user.status,
      phone: user.phone,
      createdAt: user.createdAt,
      profileImageUrl: user.profileImageUrl,
      role: {
        roleName: user.role.roleName,
        permissions: user.role.permissions.map((p) => p.permission),
      },
    };
  }

  async findByUserEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .addSelect('user.passwordHash') // <-- Include the password hash
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }




  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto); // Create the user entity
    return this.userRepository.save(user); // Save it to the database
  }

  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.roleName IS NULL OR role.roleName != :superadmin', { superadmin: 'SUPER_ADMIN' })
      .getMany();

    return users;
  }



  getAllUserStatuses() {
    return Object.values(UserStatus);
  }


  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

}
