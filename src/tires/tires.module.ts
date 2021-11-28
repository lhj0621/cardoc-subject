import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from 'src/cars/cars.module';
import { Tire } from './entities/tire.entity';
import { TiresController } from './tires.controller';
import { TiresService } from './tires.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tire]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CarsModule,
  ],
  controllers: [TiresController],
  providers: [TiresService],
})
export class TiresModule {}
