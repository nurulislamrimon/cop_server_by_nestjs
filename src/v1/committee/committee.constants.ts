import { Committee, Prisma } from '@prisma/client';

export const committeeFilterableFields: (keyof Committee)[] = [
  'id',
  'type_of_committee',
  'designation',
  'selected_at',
  'valid_till',
  'member_id',
  'created_at',
  'updated_at',
  'deleted_at',
];

export const committeeSearchableFields: (keyof Committee)[] = ['designation'];

// ------------------------------------
// select fields
// ------------------------------------

type CommitteeSelectedFields = {
  [key in keyof Partial<Prisma.CommitteeGetPayload<object>>]: boolean;
};

export const committeeSelectedFields: CommitteeSelectedFields = {
  id: true,
  type_of_committee: true,
  designation: true,
  selected_at: true,
  valid_till: true,
  member_id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};
