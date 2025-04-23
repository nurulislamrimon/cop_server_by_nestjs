// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envConfig } from './config/env.config';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { seedService } from './v1/seed.service';

export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // seed
  void seedService();

  // cors control
  const allowedOrigins = envConfig.client_url?.split(',') || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // static repo
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // api prefix
  app.setGlobalPrefix('api');

  // pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.init();
  return app;
}

// CLI use
if (require.main === module) {
  void createApp().then((app) => app.listen(envConfig.port));
}
