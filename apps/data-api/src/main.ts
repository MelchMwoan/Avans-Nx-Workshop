/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiResponseInterceptor } from '@avans-nx-workshop/backend/dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions: CorsOptions = {};
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ApiResponseInterceptor())

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Data API Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
