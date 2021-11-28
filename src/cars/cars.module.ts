import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), UserModule],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
