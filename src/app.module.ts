import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { GoogleCloudStorageModule } from './google-cloud-storage/google-cloud-storage.module';
import { CustomerModule } from './customer/customer.module';
import { EmailsModule } from './emails/emails.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { PaymentsModule } from './order/payments/payments.module';
import { SocketModule } from './sockets/socket.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { PdfGenerationModule } from './pdf-generation/pdf-generation.module';
import { FirebaseModule } from './firebase/firebase.module';
import { RedisModule } from './redis/redis.module';
import { EodClosureModule } from './eod-closure/eod-closure.module';
import { OrderSettingsModule } from './settings/order-settings/order-settings.module';

@Module({
  imports: [DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,AuthModule, RolesModule, GoogleCloudStorageModule, CustomerModule, EmailsModule, InventoryModule, OrderModule,PaymentsModule,RazorpayModule,SocketModule, QrCodeModule, PdfGenerationModule, FirebaseModule,RedisModule, EodClosureModule, OrderSettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
