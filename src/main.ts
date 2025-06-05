import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    // origin: ['https://mw-admin-136e3.web.app/','http://localhost:4200'],
    origin:true,
    credentials: true,               // allow cookies/auth headers if needed
  });
    app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically removes properties that don't have decorators
    forbidNonWhitelisted: true, // Throws an error if unknown properties are provided
    transform: true, // Automatically transforms payloads into DTO instances
    skipMissingProperties: false, // Don't skip missing properties
  }));
    app.useGlobalFilters(new TypeOrmExceptionFilter());


  // app.useGlobalGuards(new JwtAuthGuard(new Reflector()), new PermissionsGuard(new Reflector()));

  

  await app.listen(process.env.PORT ?? 3000); 
}
bootstrap();
