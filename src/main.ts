import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envConfig } from './config/env.config';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { seedService } from './v1/seed.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // seed
  void seedService();

  // cors controle
  const allowedOrigins = envConfig.client_url?.split(',') || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // static repository
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // api prefix to the path
  app.setGlobalPrefix('api');

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // response format
  app.useGlobalInterceptors(new ResponseInterceptor());

  // listen app
  await app.listen(envConfig.port);
}
void bootstrap();
