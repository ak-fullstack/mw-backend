import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Repository } from 'typeorm';


// import { RedisService } from '../redis/redis.service';


@Injectable()
export class AuthService {

  private oauthClient: OAuth2Client;


  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService,
     @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    // private readonly redisService: RedisService,

  ) {
    this.oauthClient = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));
  }
  

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
      
    const access_token = this.jwtService.sign(payload);
    // await this.redisService.setToken(user.id.toString(), access_token); 
    return {
      access_token,
      role:user.role
    };
  }


  async verifyGoogleToken(token: string): Promise<any> {
    try {
      // Verify the Google ID Token
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),  // Ensure this matches your Google OAuth Client ID
      });

      const customerDetails = ticket.getPayload();
      
      if(customerDetails && customerDetails.email_verified){
        const email = customerDetails.email;

        let customer = await this.customerRepository.findOne({
          where: { emailId: email },
        });

        if (!customer) {
          customer = this.customerRepository.create({
            emailId: email,
            firstName: customerDetails.given_name,
            lastName: customerDetails.family_name,
          });
          customer=await this.customerRepository.save(customer);
        }

        const payload = {
          sub: customer.id,
          email: customer.emailId,
          role: customer.role,
        };
          
        const access_token = this.jwtService.sign(payload);
        // await this.redisService.setToken(user.id.toString(), access_token); 
        return {
          access_token,
          role:customer.role
        };        

      }


    } catch (error) {
      throw new Error('Invalid token');
    }
  }





}
