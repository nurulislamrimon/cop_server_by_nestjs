import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberAccessRuleDto } from './create-member-access-rule.dto';

export class UpdateMemberAccessRuleDto extends PartialType(
  CreateMemberAccessRuleDto,
) {}
