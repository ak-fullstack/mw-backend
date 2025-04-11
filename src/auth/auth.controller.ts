import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from './roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // @Post('verify-otp')
  // async verifyOtp(@Body() loginDto: GenerateOtpDto): Promise<{ access_token: string }> {
  //   return this.authService.loginUser(loginDto);
  // }

  @Post('generate-otp')
  async generateOtp(@Body() loginDto: GenerateOtpDto): Promise<any> {
    return this.authService.sendOtp(loginDto);
  }

  // @Roles(Role.ADMIN) 
  // @UseGuards(RolesGuard)

}
