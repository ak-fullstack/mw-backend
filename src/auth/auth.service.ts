import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { RedisService } from '../redis/redis.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    // private readonly redisService: RedisService,

  ) {}
  

  async validateUser(email: string, otp: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);
    
    // if (user && bcrypt.compareSync(password, user.passwordHash)) {
    //   const { passwordHash, ...result } = user;
    //   return result;
    // }
    
    if(user && otp==='1111'){
        const { passwordHash, ...result } = user;
      return result;
    }

    //verifyotp code here

    throw new UnauthorizedException('Invalid credentials');
  }

  
  

  async sendOtp(generateOtpDto: GenerateOtpDto): Promise<any> {
    const user = await this.userService.findByUserEmail(generateOtpDto.email);
    if(!user){
      throw new UnauthorizedException('User not found');
    }
    //send otp code here
    return {success:true, message:'otp sent successfully'};
  }

  async verifyOtp(verifyDto: VerifyOtpDto): Promise<{ access_token: string,role:string }> {
    const user = await this.validateUser(verifyDto.email, verifyDto.otp);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions:user.role.permissions
    };

    
      console.log(payload);
      
    const access_token = this.jwtService.sign(payload);
    // await this.redisService.setToken(user.id.toString(), access_token); 
    return {
      access_token,
      role:user.role
    };
  }


}
