import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { MemberSessionModule } from './member-session/member-session.module';
import { MemberAccessRuleModule } from './member-access-rule/member-access-rule.module';
import { CommitteeModule } from './committee/committee.module';

@Module({
  imports: [
    MemberModule,
    MemberSessionModule,
    MemberAccessRuleModule,
    CommitteeModule,
  ],
})
export class V1Modules {}
