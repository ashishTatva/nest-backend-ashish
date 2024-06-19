import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StandardResponseInterceptor } from './utils/interceptors/StandardResponse.Interceptor';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new StandardResponseInterceptor());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.setGlobalPrefix('api');
  app.enableCors({ allowedHeaders: '*', origin: '*' });
  await app.listen(4010);
}

bootstrap();
