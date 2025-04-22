import { Committee_type_enum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommitteeDto {
  @IsString()
  @IsOptional()
  @IsEnum(Committee_type_enum)
  type_of_committee: Committee_type_enum;

  @IsString()
  designation: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  selected_at: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_till: Date;

  @IsNumber()
  member_id: number;
}
