import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user/user.entity';
import { environment } from '../shared/env/env';
import { UserService } from './user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload?.id) throw new UnauthorizedException();
    const user = await this.userService.userRepository.findOne(payload.id, {
      relations: ['userRoles', 'userRoles.role'],
      select: ['id', 'password', 'salt', 'email', 'username'],
    });
    if (user?.password !== payload?.password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
