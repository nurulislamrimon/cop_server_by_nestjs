import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberSessionService } from '../member-session/member-session.service';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, TransactionService, MemberSessionService],
})
export class MemberModule { }
