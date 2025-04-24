import { Member, Prisma } from '@prisma/client';

export const memberFilterableFields: (keyof Member)[] = [
  'id',
  'full_name',
  'father_name',
  'mother_name',
  'date_of_birth',
  'occupation',
  'reffered_by',
  'joining_date',
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
  'father_name',
  'mother_name',
  'phone_number',
  'occupation',
  'reffered_by',
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
  father_name: true,
  mother_name: true,
  date_of_birth: true,
  occupation: true,
  reffered_by: true,
  joining_date: true,
  phone_number: true,
  email: true,
  role: true,
  profile_photo: true,
  balance: true,
  account_status: true,
  //   password:true,
  address: true,
  created_at: true,
  //   updated_at:true,
  //   deleted_at:true,
};
