import { SetMetadata } from '@nestjs/common';
import { IPermissionRule } from '../interfaces/permission.interface';

export const ADMINISTRATOR_PERMISSION_KEY = 'member_permission';

export const AllowMemberOnlyIf = (...rules: IPermissionRule[]) =>
  SetMetadata(ADMINISTRATOR_PERMISSION_KEY, rules);
