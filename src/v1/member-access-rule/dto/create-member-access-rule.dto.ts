import { MemberRoleEnum } from '@prisma/client';
import { IsArray, IsEnum, IsIn, IsString } from 'class-validator';
import {
  permissionActions,
  memberPermissionResources,
} from '../../../constants/permission.constants';

export class CreateMemberAccessRuleDto {
  @IsString()
  @IsEnum(MemberRoleEnum)
  role: MemberRoleEnum;

  @IsArray()
  @IsIn(
    memberPermissionResources.flatMap((resource) =>
      permissionActions.map((action) => `${resource}:${action}`),
    ),
    { each: true },
  )
  rules: string[];
}
