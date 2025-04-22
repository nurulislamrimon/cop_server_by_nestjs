import {
  permissionActions,
  memberPermissionResources,
} from '../constants/permission.constants';

type Resource = (typeof memberPermissionResources)[number];

type Action = (typeof permissionActions)[number];

export type IPermissionRule = `${Resource}:${Action}`;
