import { Transaction, Prisma } from '@prisma/client';

export const transactionFilterableFields: (keyof Transaction)[] = [
  'id',
  'trx_type',
  'amount',
  'note',
  'member_id',
  'created_by_id',
  'collector_id',
  'approver_id',
  'created_at',
  'updated_at',
  'deleted_at',
];

export const transactionSearchableFields: (keyof Transaction)[] = ['note'];

// ------------------------------------
// select fields
// ------------------------------------

type TransactionSelectedFields = {
  [key in keyof Partial<Prisma.TransactionGetPayload<object>>]: boolean;
};

export const transactionSelectedFields: TransactionSelectedFields = {
  id: true,
  trx_type: true,
  amount: true,
  note: true,
  member_id: true,
  created_by_id: true,
  collector_id: true,
  approver_id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};

export const trxFieldsMap = {
  Deposit: { count: 'total_deposit', amt: 'total_deposit_amount', sign: 1 },
  Profit: { count: 'total_profit', amt: 'total_profit_amount', sign: 1 },
  Investment: { count: 'total_invest', amt: 'total_invest_amount', sign: 1 },
  Withdraw: { count: 'total_withdraw', amt: 'total_withdraw_amount', sign: -1 },
  Lose: { count: 'total_lose', amt: 'total_lose_amount', sign: -1 },
  Expense: { count: 'total_expense', amt: 'total_expense_amount', sign: -1 },
} as const;
