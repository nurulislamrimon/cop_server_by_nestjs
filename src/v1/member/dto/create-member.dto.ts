import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  full_name: string;

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

  [key: string]: any;
}
