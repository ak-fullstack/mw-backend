import { Controller,Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // @Post('verify-otp')
  // async verifyOtp(@Body() loginDto: GenerateOtpDto): Promise<{ access_token: string }> {
  //   return this.authService.loginUser(loginDto);
  // }

  @Post('send-otp')
  async generateOtp(@Body() loginDto: GenerateOtpDto): Promise<any> {
    return this.authService.sendOtp(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyDto: VerifyOtpDto): Promise<any> {
    return this.authService.verifyOtp(verifyDto);
  }



}
