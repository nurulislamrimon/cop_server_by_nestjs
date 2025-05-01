import { Transaction, Prisma } from '@prisma/client';
import { memberFilterableFields } from '../member/member.constants';

export const transactionFilterableFields: (keyof Transaction)[] = [
  'id',
  'trx_type',
  'amount',
  'note',
  'member_id',
  'created_by_id',
  'collector_id',
  'collected_at',
  'approver_id',
  'member.full_name',
  'created_at',
  'updated_at',
  'deleted_at',
] as unknown as (keyof Transaction)[];

memberFilterableFields
  .map((member) => `member.${member}`)
  .forEach((member: keyof Transaction) =>
    transactionFilterableFields.push(member),
  );

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
  collected_at: true,
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
  Loss: { count: 'total_loss', amt: 'total_loss_amount', sign: -1 },
  Expense: { count: 'total_expense', amt: 'total_expense_amount', sign: -1 },
} as const;
