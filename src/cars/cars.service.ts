import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private carsRepository: Repository<Car>,
    private userService: UserService,
  ) {}

  async createCar(createCarDto: CreateCarDto, user_id: string): Promise<Car> {
    const user = await this.userService.findOneByUserId(user_id);

    if (!user) {
      throw new BadRequestException('해당 유저가 존재하지 않습니다.');
    }

    const car = this.carsRepository.create({
      tirm_id: createCarDto.trimId,
      user,
    });

    try {
      return await this.carsRepository.save(car);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
