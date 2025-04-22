import { Member, Prisma } from '@prisma/client';

export const memberFilterableFields: (keyof Member)[] = [
  'id',
  'full_name',
  'phone_number',
  'email',
  'role',
  'address',
  'is_active',
  'balance',
  'created_at',
  'updated_at',
  'deleted_at',
];

export const memberSearchableFields: (keyof Member)[] = [
  'full_name',
  'phone_number',
  'email',
  'address',
];

// ------------------------------------
// select fields
// ------------------------------------

type MemberSelectedFields = {
  [key in keyof Partial<Prisma.MemberGetPayload<object>>]: boolean;
};

export const memberSelectedFields: MemberSelectedFields = {
  id: true,
  full_name: true,
  phone_number: true,
  email: true,
  role: true,
  profile_photo: true,
  balance: true,
  //   password:true,
  address: true,
  created_at: true,
  //   updated_at:true,
  //   deleted_at:true,
};
