import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberSessionService } from '../member-session/member-session.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberSessionService],
})
export class MemberModule {}
