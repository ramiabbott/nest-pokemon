import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2'); // Set the global prefix for all routes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })); // Enable validation and transformation of DTOs
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
