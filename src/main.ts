import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './http-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);

  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(3000);
}

bootstrap();
