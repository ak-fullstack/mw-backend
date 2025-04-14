import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:4200', // allow Angular app
    credentials: true,               // allow cookies/auth headers if needed
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically removes properties that don't have decorators
    forbidNonWhitelisted: true, // Throws an error if unknown properties are provided
    transform: true, // Automatically transforms payloads into DTO instances
    skipMissingProperties: false, // Don't skip missing properties
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
