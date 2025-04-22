export const saltRounds = 10;

export const uploadDir = './public';

// search and filters fields
export const numberFields: string[] = [
  'id',
  'member_id',
  'created_by_id',
  'collector_id',
  'approver_id',
  'balance',
  'total_deposit',
  'total_withdraw',
  'total_expense',
  'total_profit',
  'total_lose',
  'total_invest',
  'total_deposit_amount',
  'total_withdraw_amount',
  'total_expense_amount',
  'total_profit_amount',
  'total_lose_amount',
  'total_invest_amount',
];

export const dateFields: string[] = [
  'selected_at',
  'valid_till',
  'created_at',
  'updated_at',
  'deleted_at',
];

export const booleanFields: string[] = [
  'is_active',
  'is_verified',
  'is_maintenance_mode',
];
