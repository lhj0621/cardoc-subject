import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: {
        user_id: createUserDto.user_id,
      },
    });

    if (checkUser) {
      throw new ConflictException('이미 가입된 아이디입니다.');
    }

    const user = this.userRepository.create(createUserDto);
    try {
      const result = await this.userRepository.save(user);
      delete result.password;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        '회원 가입에 오류가 발생하였습니다.',
      );
    }
  }
}
