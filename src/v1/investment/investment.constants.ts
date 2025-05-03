import { Investment, Prisma, Member } from '@prisma/client';

export const investmentFilterableFields: (keyof Investment)[] = [
  'id',
  'project_name',
  'manager_name',
  'manager_mobile',
  'invested_amount',
  'return_amount',
  'profit',
  'loss',
  'percentage_of_returns',
  'investment_date',
  'maturity_date',
  'status',
  'created_at',
  'updated_at',
  'deleted_at',
];


export const investmentSearchableFields: (keyof Investment)[] = [
  'project_name',
  'manager_name',
];

// ------------------------------------
// select fields
// ------------------------------------

type InvestmentSelectedFields = {
  [key in keyof Partial<Prisma.InvestmentGetPayload<object>>]: boolean;
};

export const investmentSelectedFields: InvestmentSelectedFields = {
  'id': true,
  'project_name': true,
  'manager_name': true,
  'manager_mobile': true,
  'invested_amount': true,
  'return_amount': true,
  'profit': true,
  'loss': true,
  'percentage_of_returns': true,
  'investment_date': true,
  'maturity_date': true,
  'status': true,
  'created_at': true,
  'updated_at': true,
  'deleted_at': true,
};
