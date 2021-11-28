import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
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

  async logIn(loginDto: LogInDto): Promise<{ accessToken: string }> {
    const { user_id, password } = loginDto;
    const user = await this.userRepository.findOne({ user_id });

    if (user && (await bcrypt.compare(password, user.password))) {
      const loginedAt = new Date();
      user.logined_at = loginedAt;
      await this.userRepository.save(user);
      return this.authService.jwtSign(user);
    } else {
      throw new UnauthorizedException('login fail');
    }
  }

  async findOneByUserId(user_id: string): Promise<User> {
    const user = await this.userRepository.findOne({ user_id });
    if (!user) {
      throw new NotFoundException('유효한 아이디가 아닙니다.');
    }
    return user;
  }
}
