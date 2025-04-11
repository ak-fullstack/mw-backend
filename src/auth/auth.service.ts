import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,

  ) {}
  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);
    
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  
  

  async sendOtp(generateOtpDto: GenerateOtpDto): Promise<any> {
    const user = await this.userService.findByUserEmail(generateOtpDto.email);
    //otp logic

    return {success:true, message:'otp sent successfully'};
  }

  // async verifyOtp(loginDto: LoginDto): Promise<{ access_token: string }> {
  //   const user = await this.validateUser(loginDto.email, loginDto.otp);    
  //   const payload = { username: user.username, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
