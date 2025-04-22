import { Module } from '@nestjs/common';
import { MemberAccessRuleService } from './member-access-rule.service';
import { MemberAccessRuleController } from './member-access-rule.controller';

@Module({
  controllers: [MemberAccessRuleController],
  providers: [MemberAccessRuleService],
})
export class MemberAccessRuleModule {}
