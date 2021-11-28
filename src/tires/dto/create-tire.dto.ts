import { IsNumber, IsString } from 'class-validator';

export class CreateTireDto {
  @IsString()
  userId: string;

  @IsNumber()
  trimId: number;
}
