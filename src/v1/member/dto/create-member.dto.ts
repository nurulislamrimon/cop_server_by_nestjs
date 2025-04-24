import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  full_name: string;

  @IsString()
  @IsOptional()
  father_name: string;

  @IsString()
  @IsOptional()
  mother_name: string;


  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsString()
  phone_number: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase()?.trim())
  email: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  profile_photo?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  address?: string;


  @IsOptional()
  @IsDate()
  @Type(() => Date)
  joining_date: Date;

  [key: string]: any;
}
