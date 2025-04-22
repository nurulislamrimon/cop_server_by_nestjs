import { SetMetadata } from '@nestjs/common';
import { IPermissionRule } from '../interfaces/permission.interface';

export const PERMISSION_KEY = 'permission';

export const AllowIf = (...rules: IPermissionRule[]) =>
  SetMetadata(PERMISSION_KEY, rules);
