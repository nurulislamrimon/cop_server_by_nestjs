import { Member_access_rule, Prisma } from '@prisma/client';

export const member_access_ruleFilterableFields: (keyof Member_access_rule)[] =
  ['id', 'role', 'rules', 'created_at', 'updated_at', 'deleted_at'];

export const member_access_ruleSearchableFields: (keyof Member_access_rule)[] =
  ['role'];

// ------------------------------------
// select fields
// ------------------------------------

type Member_access_ruleSelectedFields = {
  [key in keyof Partial<Prisma.Member_access_ruleGetPayload<object>>]: boolean;
};

export const member_access_ruleSelectedFields: Member_access_ruleSelectedFields =
  {
    id: true,
    role: true,
    rules: true,
    created_at: true,
    //   updated_at:true,
    //   deleted_at:true,
  };
