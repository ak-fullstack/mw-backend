import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { EmailsService } from 'src/emails/emails.service';
import { CustomerService } from 'src/customer/customer.service';
// import { RedisService } from 'src/redis/redis.service';
// import { RedisModule } from 'src/redis/redis.module';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/entities/otp.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { WalletService } from 'src/customer/wallet/wallet.service';
import { WalletModule } from 'src/customer/wallet/wallet.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, EmailsService,CustomerService],
  exports: [AuthService, JwtStrategy, JwtAuthGuard], 
  imports:[
    // RedisModule,
    FirebaseModule,
    WalletModule,
    TypeOrmModule.forFeature([Customer,Otp]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    OtpModule,
  ]
})
export class AuthModule {}
