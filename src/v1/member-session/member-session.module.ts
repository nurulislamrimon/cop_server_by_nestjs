import { Module } from '@nestjs/common';
import { MemberSessionService } from './member-session.service';
import { MemberSessionController } from './member-session.controller';

@Module({
  controllers: [MemberSessionController],
  providers: [MemberSessionService],
  exports: [MemberSessionService],
})
export class MemberSessionModule {}
