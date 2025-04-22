export const sellerPermissionResources = [
  'brand',
  'category',
  'coupon',
  'customer',
  'customer_session',
  'delivery_fee',
  'dynamic_page',
  'footer',
  'free_shipping',
  'home_page_meta',
  'payment_method',
  'product',
  'saved_attribute',
  'seller',
  'seller_session',
  'shop',
  'subscription',
  'slider',
  'tax_rate',
] as const;

export const memberPermissionResources = [
  'member',
  'member_access_rule',
  'member_session',
  'seller_access_rule',
  ...sellerPermissionResources,
] as const;

export const permissionActions = [
  '*',
  'read',
  'write',
  'delete',
  'update',
] as const;
