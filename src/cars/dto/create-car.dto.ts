import { IsNumber } from 'class-validator';

export class CreateCarDto {
  @IsNumber()
  trimId: number;
}
