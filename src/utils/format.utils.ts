import { BadRequestException } from '@nestjs/common';
import { IPagination } from '../interfaces/format.interfaces';
import { bdMobileNumberRegex } from './validators.utils';

export const formatPagination = (pagination: any): IPagination => {
  const { sortBy, sortOrder, page, limit } = pagination;
  const skip = (Number(page) - 1) * Number(limit);
  return {
    orderBy: {
      [sortBy]: sortOrder === 'asc' ? ('asc' as const) : ('desc' as const),
    },
    skip,
    take: Number(limit),
  };
};

export const formatOrder = (value: string | number): 'asc' | 'desc' => {
  const numValue = Number(value);
  const isString = Number.isNaN(numValue);

  if (!isString && (numValue === 1 || numValue === -1)) {
    return numValue === 1 ? 'asc' : 'desc';
  } else {
    return value === 'asc' || value === 'ascending' ? 'asc' : 'desc';
  }
};

export const formatEmailWithException = (email: string): string => {
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  const isValid = emailRegex.test(email);

  if (isValid) {
    return email.toLowerCase();
  } else {
    throw new BadRequestException('Invalid email format');
  }
};

export const formatBDMobileNumberWithException = (
  mobile_number: string,
): string => {
  const isValid = bdMobileNumberRegex.test(mobile_number);

  if (isValid) {
    return mobile_number.replace(/^(\+?88)?01([3-9]\d{8})$/, '+8801$2');
  } else {
    throw new BadRequestException('Invalid mobile number format');
  }
};
