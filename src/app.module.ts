import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1Modules } from './v1/v1.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PrismaExceptionFormatter } from './utils/ExceptionsFormatter/prisma.exceptions';
import { DtoValidationFormatter } from './utils/ExceptionsFormatter/dto.exceptions';
import { OtherExceptionFormatter } from './utils/ExceptionsFormatter/other.exceptions';
import { GlobalExceptionFilter } from './interceptors/exception.interceptor';
import { PrismaModule } from './lib/prisma/prisma.module';
import { CloudflareModule } from './lib/cloudflare/cloudflare.module';
import { MailModule } from './lib/mail/mail.module';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { PermissionGuard } from './guards/Permission.guard';

@Module({
  // ========================
  // imports ============
  // ========================
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    // modules =============
    // global modules
    PrismaModule,
    CloudflareModule,
    MailModule,
    // version based modules
    V1Modules,
  ],
  // ========================
  // controllers ============
  // ========================
  controllers: [AppController],
  // ========================
  // providers ============
  // ========================
  providers: [
    AppService,
    // guards ======================
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    // exception formatter ==============
    PrismaExceptionFormatter,
    DtoValidationFormatter,
    OtherExceptionFormatter,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
