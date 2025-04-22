import { IsArray, IsIn, IsString } from 'class-validator';
import {
  permissionActions,
  memberPermissionResources,
} from '../../../constants/permission.constants';

export class CreateMemberAccessRuleDto {
  @IsString()
  role: string;

  @IsArray()
  @IsIn(
    memberPermissionResources.flatMap((resource) =>
      permissionActions.map((action) => `${resource}:${action}`),
    ),
    { each: true },
  )
  rules: string[];
}
