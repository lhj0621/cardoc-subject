import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  jwtSign(user: User): { accessToken: string } {
    const payload = {
      id: user.id,
      user_id: user.user_id,
      logined_at: user.logined_at,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
