import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repository';
import { User } from './user/user.entity';
import { getEnvVar } from '../util/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getEnvVar('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload?.id) throw new UnauthorizedException();
    const user = await this.userRepository.findOne(payload.id, {
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
