import { IsString } from 'class-validator';

export class CreateMemberSessionDto {
  @IsString()
  ip: string;

  @IsString()
  user_agent: string;

  @IsString()
  device: string;

  @IsString()
  platform: string;

  @IsString()
  browser: string;

  member_id: number;
}
