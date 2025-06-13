import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { SendUserLoginOtpDto } from './dto/send-user-login-otp.dto';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // @Post('verify-otp')
  // async verifyOtp(@Body() loginDto: GenerateOtpDto): Promise<{ access_token: string }> {
  //   return this.authService.loginUser(loginDto);
  // }

  @Post('send-admin-otp')
  async generateOtp(@Body() sendUserLoginOtpDto: SendUserLoginOtpDto): Promise<any> {
    return this.authService.sendOtp(sendUserLoginOtpDto);
  }

  @Post('verify-admin-otp')
  async verifyOtp(@Body() verifyDto: VerifyOtpDto): Promise<any> {
    return this.authService.verifyOtp(verifyDto);
  }


  @Post('verify-oauth-token')
  async verifyToken(
    @Body() body: { token: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { token } = body;

    if (!token) {
      return { error: 'Token is required' };
    }

    try {
      // Call your internal login method (this should set the cookie using res)
      const response = await this.authService.verifyGoogleToken(token, res);
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
  async verifyCustomerEmailOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.verifyCustomerOtp(verifyOtpDto.email, verifyOtpDto.otp, res, verifyOtpDto.purpose);
  }

  @Post('customer-login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const customer = await this.authService.customerLogin(
      loginDto.email,
      loginDto.password,
      res
    );

    // Only return safe data (no token here)
    return { role: customer.role };
  }

  @Post('send-reset-otp')
  async sendResetOtp(@Body() generateOtpDto: GenerateOtpDto) {
    const response = await this.authService.sendOtpForPasswordReset(generateOtpDto.email);
    return response;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear HttpOnly cookie named 'token'
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true, // use secure in prod
      expires: new Date(0), // Expire immediately
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }

}
