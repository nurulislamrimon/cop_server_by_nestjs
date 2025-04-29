export const memberPermissionResources = [
  'member',
  'member_access_rule',
  'member_session',
  'committee',
  'transaction',

  // client side
  'manage'
] as const;

export const permissionActions = [
  '*',
  'read',
  'write',
  'delete',
  'update',
] as const;
