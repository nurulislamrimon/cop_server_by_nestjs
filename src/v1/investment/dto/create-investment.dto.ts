import { InvestmentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  project_name: string;

  @IsString()
  manager_name: string;

  @IsString()
  manager_mobile: string;

  @IsNumber()
  @IsPositive()
  invested_amount: number;

  @IsOptional()
  @IsNumber()
  return_amount?: number;

  @IsOptional()
  @IsNumber()
  profit?: number;

  @IsOptional()
  @IsNumber()
  loss?: number;

  @IsOptional()
  @IsNumber()
  percentage_of_returns?: number;

  @IsDate()
  @Type(() => Date)
  investment_date: Date;

  @IsDate()
  @Type(() => Date)
  maturity_date: Date;

  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deleted_at?: Date;
}

export class CreateAdditionalInvestmentDto {
  @IsString()
  project_name: string;

  @IsString()
  manager_name: string;

  @IsString()
  manager_mobile: string;

  @IsNumber()
  @IsPositive()
  invested_amount: number;

  @IsNumber()
  @IsPositive()
  investment_id: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deleted_at?: Date;
}
