import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { MemberSessionModule } from './member-session/member-session.module';
import { MemberAccessRuleModule } from './member-access-rule/member-access-rule.module';
import { CommitteeModule } from './committee/committee.module';
import { TransactionModule } from './transaction/transaction.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvestmentModule } from './investment/investment.module';

@Module({
  imports: [
    MemberModule,
    MemberSessionModule,
    MemberAccessRuleModule,
    CommitteeModule,
    TransactionModule,
    DashboardModule,
    InvestmentModule
  ],
})
export class V1Modules { }
