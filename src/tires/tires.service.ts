import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarsService } from '../cars/cars.service';
import { Connection, Repository } from 'typeorm';
import { CreateTireDto } from './dto/create-tire.dto';
import { Tire } from './entities/tire.entity';

@Injectable()
export class TiresService {
  constructor(
    @InjectRepository(Tire) private tiresRepository: Repository<Tire>,
    private httpService: HttpService,
    private carsService: CarsService,
    private connection: Connection,
  ) {}
  async createTires(createTireDtos: CreateTireDto[]): Promise<Tire[]> {
    const createdTireList: Tire[] = [];
    for (const createTireDto of createTireDtos) {
      const { userId, trimId } = createTireDto;
      const { frontTire, rearTire } = await this.getTireInfoAPI(trimId);
      const frontTireInfo = this.convertTireInfo(frontTire);
      const rearTireInfo = this.convertTireInfo(rearTire);

      createdTireList.push(
        await this.createTireTransactions(
          trimId,
          userId,
          frontTireInfo,
          rearTireInfo,
        ),
      );
    }
    return createdTireList;
  }

  private async createTireTransactions(
    trimId: number,
    userId: string,
    frontTireInfo: { width: number; aspectRatio: number; wheelSize: number },
    rearTireInfo: { width: number; aspectRatio: number; wheelSize: number },
  ): Promise<Tire> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const car = await this.carsService.createCar({ trimId }, userId);

      const tire = this.tiresRepository.create({
        front_width: frontTireInfo.width,
        front_aspect_ratio: frontTireInfo.aspectRatio,
        front_wheel_size: frontTireInfo.wheelSize,
        rear_width: rearTireInfo.width,
        rear_aspect_ratio: rearTireInfo.aspectRatio,
        rear_wheel_size: rearTireInfo.wheelSize,
        car: car,
      });

      const resultTireData = await this.tiresRepository.save(tire);

      await queryRunner.commitTransaction();
      return resultTireData;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `${err} - userId : ${userId} / trimId: ${trimId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getTireInfoAPI(trimId: number): Promise<any> {
    const url = `https://dev.mycar.cardoc.co.kr/v1/trim/${trimId}`;
    return await this.httpService
      .get(url)
      .toPromise()
      .then((API_DATA) => {
        const frontTire = API_DATA.data.spec.driving.frontTire.value;
        const rearTire = API_DATA.data.spec.driving.rearTire.value;

        return { frontTire, rearTire };
      })
      .catch(() => {
        throw new BadRequestException(
          `올바르지 않은 차량 번호 입니다. - ${trimId} `,
        );
      });
  }

  convertTireInfo(tireInfo: string): {
    width: number;
    aspectRatio: number;
    wheelSize: number;
  } {
    if (tireInfo.search(/^[0-9]{3}\/[0-9]{2}R[0-9]{2}/g) == -1) {
      throw new InternalServerErrorException(
        `올바르지 않은 포맷 입니다. - ${tireInfo}`,
      );
    }
    const [width, aspectRatio, wheelSize] = tireInfo
      .split(/\/|\D/)
      .map((num) => parseInt(num));
    return { width, aspectRatio, wheelSize };
  }
}
