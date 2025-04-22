import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberSessionDto } from './create-member-session.dto';

export class UpdateMemberSessionDto extends PartialType(
  CreateMemberSessionDto,
) {}
