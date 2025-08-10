import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { MoreThan, Repository } from 'typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { CustomerService } from 'src/customer/customer.service';
import { SendUserLoginOtpDto } from './dto/send-user-login-otp.dto';
import { Response } from 'express';
import { OtpService } from './otp/otp.service';
import { Otp } from './otp/entities/otp.entity';
import { VerifyUserOtpDto } from './dto/verify-user-otp.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WalletService } from 'src/customer/wallet/wallet.service';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { getMenuForUser } from 'src/common/utils/menu.util';
import { RedisService } from 'src/redis/redis.service';



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
    private walletService:WalletService,
    private redisService : RedisService,
    private otpService: OtpService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private readonly firebaseService:FirebaseService
    // private readonly redisService: RedisService,

  ) {
    this.oauthClient = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));

  }








  async sendOtp(sendUserLoginOtpDto: SendUserLoginOtpDto): Promise<any> {
    const user = await this.userService.findByUserEmailWithPassword(sendUserLoginOtpDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

     if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is Blocked');
    }

    const isPasswordValid = await user.comparePassword(sendUserLoginOtpDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }    
    // const { code } = await this.otpService.generateOtp(sendUserLoginOtpDto.email);
    // await this.emailService.sendOtpMail(sendUserLoginOtpDto.email, code)
    return { success: true, message: 'Password Validated',phone:user.phone };
  }

  async verifyUserOtp(verifyUserDto: VerifyUserOtpDto): Promise<{}> {
    // const user = await this.validateUser(verifyUserDto.email, verifyUserDto.token);
    const user = await this.userService.findByUserEmail(verifyUserDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

     if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is Blocked');
    }

    const decoded=await this.firebaseService.verifyToken(verifyUserDto.token);
    const decodedPhone = decoded.phone_number?.replace(/^\+91/, '');

    if (!decodedPhone || decodedPhone !== user.phone) {
  throw new UnauthorizedException('Phone number mismatch');
}

  const userPermissions: PermissionEnum[] = (user.role?.permissions || []).filter(p =>
    Object.values(PermissionEnum).includes(p as PermissionEnum)
  ) as PermissionEnum[];
  
  const filteredMenu = getMenuForUser(userPermissions);
  
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.role.permissions,
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
      createdAt: user.createdAt,
      menu:filteredMenu
    };
  }

  async validateUser(email: string, otp: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);

    if(!user){
            throw new UnauthorizedException('You are an outsider');
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is Blocked');
    }

      const now = new Date();

  const storedOtp = await this.otpRepository.findOne({
    where: {
      email,
      code: otp,
      used: false,
      expiresAt: MoreThan(now),
    },
    order: { createdAt: 'DESC' },
  });

  if (!storedOtp) {
    throw new BadRequestException('OTP expired, invalid, or already used.');
  }
  storedOtp.used = true;
  await this.otpRepository.save(storedOtp);

    if (user) {
      const { passwordHash, ...result } = user;
      return result;
    }

    //verifyotp code here

    throw new UnauthorizedException('Invalid credentials');
  }


  async verifyGoogleToken(token: string, res: Response): Promise<any> {
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
            await this.walletService.createWalletForCustomer(customer.id);

          //call a function in wallet service to create a wallet for the customer
        }

        return this.setCustomerToken(customer, res);

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
    const { code } = await this.otpService.generateOtp(email);
    await this.emailService.sendOtpMail(email, code);

    // You can store OTP temporarily for verification purposes (in-memory, cache, or DB)

    return {
      message: `OTP sent to ${email}`,
    };
  }

  async sendOtpForPasswordReset(email: string): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { emailId: email.toLowerCase() } });
    if (customer) {
      const { code } = await this.otpService.generateOtp(email)
      await this.emailService.sendOtpMail(email, code);
      return {
        message: `OTP sent to ${email}`,
      };
    }
    throw new NotFoundException('Customer not found. Cannot send OTP for non-existing user.');

    // You can store OTP temporarily for verification purposes (in-memory, cache, or DB)


  }



  async verifyCustomerOtp(email: string, otp: string, res: Response, purpose?: string): Promise<any> {

    const now = new Date();

    const storedOtp = await this.otpRepository.findOne({
      where: {
        email,
        code: otp,
        used: false,
        expiresAt: MoreThan(now),
      },
      order: { createdAt: 'DESC' },
    });

    if (!storedOtp) {
      throw new BadRequestException('OTP expired, invalid, or already used.');
    }

    // Mark OTP as used
    storedOtp.used = true;
    await this.otpRepository.save(storedOtp);


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
    return { message: 'OTP verified successfully' };
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

  async setCustomerToken(customer, res) {
    const payload = {
      sub: customer.id,
      email: customer.emailId,
      role: customer.role,
    };

    const access_token = this.jwtService.sign(payload);

    await this.redisService.setToken(customer.id,access_token,'customer');
    
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




