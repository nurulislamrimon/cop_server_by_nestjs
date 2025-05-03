export const memberPermissionResources = [
  'member',
  'member_access_rule',
  'member_session',
  'committee',
  'transaction',
  'investment',

  // client side
  'manage',
] as const;

export const permissionActions = [
  '*',
  'read',
  'write',
  'delete',
  'update',
] as const;
