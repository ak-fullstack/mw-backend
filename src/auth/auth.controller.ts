import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { Role } from '../enum/roles.enum';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

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

  @Get('roles')
  @Roles(Role.SUPERADMIN) 
  @UseGuards(RolesGuard)
  getRoles(): Promise<Role[]> {
    return this.authService.getRoles()  // Get all roles from the enum
  }

  // @Roles(Role.ADMIN) 
  // @UseGuards(RolesGuard)

}
