import {
  BadRequestException,
  Body,
  Controller,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { CreateTireDto } from './dto/create-tire.dto';
import { Tire } from './entities/tire.entity';
import { TiresService } from './tires.service';

@Controller('tires')
export class TiresController {
  constructor(private readonly tiresService: TiresService) {}
  @Post()
  async createTires(
    @Body(new ParseArrayPipe({ items: CreateTireDto }))
    createTireDtos: CreateTireDto[],
  ): Promise<Tire[]> {
    if (createTireDtos.length > 5 || createTireDtos.length === 0) {
      throw new BadRequestException(
        '입력된 데이터가 5개를 초과하거나 없습니다.',
      );
    }

    return this.tiresService.createTires(createTireDtos);
  }
}
