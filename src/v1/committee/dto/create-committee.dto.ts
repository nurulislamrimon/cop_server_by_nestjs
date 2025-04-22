import { Committee_type_enum } from '@prisma/client';
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

  @IsDate()
  @IsOptional()
  selected_at: Date;

  @IsDate()
  @IsOptional()
  valid_till: Date;

  @IsNumber()
  member_id: number;
}
