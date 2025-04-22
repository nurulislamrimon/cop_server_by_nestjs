export const saltRounds = 10;

export const uploadDir = './public';

// search and filters fields
export const numberFields: string[] = [
  'id',
  'owner_id',
  'seller_id',
  'customer_id',
  'order_id',
  'request_no',
  'price',
  'total_amount',
  'cod_collect',
];

export const dateFields: string[] = [
  'subscribed_at',
  'expires_at',
  'created_at',
  'updated_at',
  'deleted_at',
];

export const booleanFields: string[] = [
  'is_active',
  'is_verified',
  'is_maintenance_mode',
];
