import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,AuthModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
