import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginMemberDto {
  @IsString()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase()?.trim())
  email: string;

  @IsString()
  password: string;
}

export class PasswordDto {
  inputPassword: string;
  currentPassword: string;
}
