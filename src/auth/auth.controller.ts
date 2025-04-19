import { Controller,Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // @Post('verify-otp')
  // async verifyOtp(@Body() loginDto: GenerateOtpDto): Promise<{ access_token: string }> {
  //   return this.authService.loginUser(loginDto);
  // }

  @Post('send-admin-otp')
  async generateOtp(@Body() loginDto: GenerateOtpDto): Promise<any> {
    return this.authService.sendOtp(loginDto);
  }

  @Post('verify-admin-otp')
  async verifyOtp(@Body() verifyDto: VerifyOtpDto): Promise<any> {
    return this.authService.verifyOtp(verifyDto);
  }


  @Post('verify-oauth-token')
  async verifyToken(@Body() body: { token: string }) {
    const { token } = body;
    
    if (!token) {
      return { error: 'Token is required' };
    }

    try {
      const response = await this.authService.verifyGoogleToken(token);
      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('register/send-customer-email-otp')
  async sendOtp(@Body() generateOtpDto: GenerateOtpDto): Promise<{ message: string }> {
    return this.authService.sendCustomerEmailOtpForRegistartion(generateOtpDto.email);
  }

  @Post('verify-customer-email-otp')
async verifyCustomerEmailOtp(@Body() verifyOtpDto: VerifyOtpDto) {
  return this.authService.verifyCustomerOtp(verifyOtpDto.email, verifyOtpDto.otp,verifyOtpDto.purpose);
}

@Post('customer-login')
async login(@Body() loginDto: LoginDto) : Promise<any> {
  const customer = await this.authService.customerLogin(loginDto.email, loginDto.password);
  return  customer;

}

@Post('send-reset-otp')
async sendResetOtp(@Body() generateOtpDto: GenerateOtpDto) {
  const response = await this.authService.sendOtpForPasswordReset(generateOtpDto.email);
  return response;
}

}
