import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { CustomerService } from 'src/customer/customer.service';
import { SendUserLoginOtpDto } from './dto/send-user-login-otp.dto';
import { Response } from 'express';



// import { RedisService } from '../redis/redis.service';


@Injectable()
export class AuthService {

  private oauthClient: OAuth2Client;


  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService,
    private emailService: EmailsService,
    private customerService: CustomerService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    // private readonly redisService: RedisService,

  ) {
    this.oauthClient = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));

  }


  async validateUser(email: string, otp: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is Blocked');
    }

    // if (user && bcrypt.compareSync(password, user.passwordHash)) {
    //   const { passwordHash, ...result } = user;
    //   return result;
    // }

    if (user && otp === '1111') {
      const { passwordHash, ...result } = user;
      return result;
    }

    //verifyotp code here

    throw new UnauthorizedException('Invalid credentials');
  }






  async sendOtp(sendUserLoginOtpDto: SendUserLoginOtpDto): Promise<any> {
    const user = await this.userService.findByUserEmailWithPassword(sendUserLoginOtpDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await user.comparePassword(sendUserLoginOtpDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Send OTP logic goes here
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(verifyDto: VerifyOtpDto): Promise<{}> {
    const user = await this.validateUser(verifyDto.email, verifyDto.otp);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.role.permissions
    };

    const access_token = this.jwtService.sign(payload);
    // await this.redisService.setToken(user.id.toString(), access_token); 
    return {
      access_token,
      role: user.role,
      name: user.name,
      email: user.email,
      status: user.status,
      profileImageUrl: user.profileImageUrl,
      phone: user.phone,
      createdAt: user.createdAt
    };
  }


  async verifyGoogleToken(token: string,res: Response): Promise<any> {
    try {
      // Verify the Google ID Token
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),  // Ensure this matches your Google OAuth Client ID
      });

      const customerDetails = ticket.getPayload();

      if (customerDetails && customerDetails.email_verified) {
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
          customer = await this.customerRepository.save(customer);
        }

        return this.setCustomerToken(customer,res);

        // const payload = {
        //   sub: customer.id,
        //   email: customer.emailId,
        //   role: customer.role,
        // };

        // const access_token = this.jwtService.sign(payload);
        // return {
        //   access_token,
        //   role: customer.role
        // };

      }


    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async sendCustomerEmailOtpForRegistartion(email: string): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { emailId: email } });
    if (customer) {
      // If email exists and passwordHash is null, return an error
      if (!customer.passwordHash) {
        throw new ConflictException('You have signed up using Google. Please log in using Google.');
      }
      throw new ConflictException('Account already exists. Please log in.');

    }

    await this.emailService.sendOtpMail(email);

    // You can store OTP temporarily for verification purposes (in-memory, cache, or DB)

    return {
      message: `OTP sent to ${email}`,
    };
  }

  async sendOtpForPasswordReset(email: string): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { emailId: email.toLowerCase() } });
    if (customer) {
      await this.emailService.sendOtpMail(email);
      return {
        message: `OTP sent to ${email}`,
      };
    }
    throw new NotFoundException('Customer not found. Cannot send OTP for non-existing user.');

    // You can store OTP temporarily for verification purposes (in-memory, cache, or DB)


  }



  async verifyCustomerOtp(email: string, otp: string,res: Response, purpose?: string): Promise<any> {

    const storedOtp = '1111';

    if (!storedOtp) {
      throw new BadRequestException('OTP expired or not found.');
    }

    if (storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP.');
    }


    const payload = {
      email: email,
      purpose: purpose,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '5m' });
     res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 5,
      path: '/',
    });
    return {message: 'OTP verified successfully'};
  }


  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerService.findByCustomerEmail(email);

    if (!customer) {
      throw new UnauthorizedException('Account does not exist. Register for an account');
    }

    const isPasswordValid = await customer.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return customer
  }

  async customerLogin(
    email: string,
    password: string,
    res: Response
  ): Promise<any> {
    const customer = await this.validateCustomer(email, password);

    return this.setCustomerToken(customer, res);
  }

  async setCustomerToken(customer,res){
    const payload = {
      sub: customer.id,
      email: customer.emailId,
      role: customer.role,
    };

    const access_token = this.jwtService.sign(payload);
    
    // Set HTTP-only cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    

    return {
      role: customer.role,
    };
  }

}




