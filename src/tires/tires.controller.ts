import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTireDto } from './dto/create-tire.dto';
import { Tire } from './entities/tire.entity';
import { TiresService } from './tires.service';

@Controller('tires')
export class TiresController {
  constructor(private readonly tiresService: TiresService) {}
  @Get('')
  @HttpCode(200)
  getTireList(
    @Query('user_id') userId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const limitData = limit ? Number(limit) : 10;
    const offset = page ? (Number(page) - 1) * limitData : 0;
    return this.tiresService.findTireListByUserId(userId, limitData, offset);
  }

  @Post()
  @HttpCode(200)
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
