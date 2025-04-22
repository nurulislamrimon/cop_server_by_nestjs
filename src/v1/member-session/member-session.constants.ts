import { Member_session, Prisma } from '@prisma/client';

export const memberSessionFilterableFields: (keyof Member_session)[] = [
  'id',
  'ip',
  'user_agent',
  'device',
  'platform',
  'browser',
  'created_at',
  'updated_at',
  'deleted_at',
];
export const memberSessionSearchableFields: (keyof Member_session)[] = [
  'ip',
  'user_agent',
  'device',
  'platform',
  'browser',
];

// ------------------------------------
// select fields
// ------------------------------------

type MemberSessionSelectedFields = {
  [key in keyof Partial<Prisma.Member_sessionGetPayload<object>>]: boolean;
};

export const memberSessionSelectedFields: MemberSessionSelectedFields = {
  id: true,
  ip: true,
  user_agent: true,
  device: true,
  platform: true,
  browser: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};
