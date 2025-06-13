import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Otp } from './entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  
  constructor( @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,){
  }

  async generateOtp(email:string){
     const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

     const existingOtp = await this.otpRepo.findOne({
    where: { email },
    order: { createdAt: 'DESC' },
  });
  
    if (existingOtp) {
    existingOtp.code = code;
    existingOtp.expiresAt = expiresAt;
    existingOtp.used = false;
    return await this.otpRepo.save(existingOtp);
  }
    return await this.otpRepo.save({ email, code, expiresAt });
  }
}
