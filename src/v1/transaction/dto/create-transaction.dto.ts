import { Transaction_type_enum } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  @IsEnum(Transaction_type_enum)
  trx_type: Transaction_type_enum;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsNumber()
  @IsPositive()
  member_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  created_by_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  collector_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  approver_id: number;
}
