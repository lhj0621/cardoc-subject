import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  user_id: string;

  @IsString()
  password: string;
}
