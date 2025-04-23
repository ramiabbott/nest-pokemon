import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2'); // Set the global prefix for all routes
  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true, 
       forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion for primitive types
      },
      
      })); // Enable validation and transformation of DTOs
  const port = process.env.PORT || 3000; // Use a default port if undefined
  await app.listen(port);
}
bootstrap();
