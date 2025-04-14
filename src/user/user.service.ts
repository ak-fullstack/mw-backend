import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User> 
    ) {}
  


    async findByUserEmail(email: string): Promise<User | null> {
      return await await this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'email', 'passwordHash','role'],  
    });
    }

}
