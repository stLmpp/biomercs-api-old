import {
  UserRegisterDto,
  UserRegisterViewModel,
} from './user/dto/register.dto';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from './user/dto/credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RouteParamTerm, RoutePath } from '../shared/types/route-enums';
import { getEnvVar, getHost, getPort } from '../util/env';
import { Entity } from '../util/types';

export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  async register(dto: UserRegisterDto): Promise<UserRegisterViewModel> {
    let user = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
      select: ['id', 'email', 'emailToken'],
    });
    if (!user) {
      user = await this.userRepository.register(dto);
    } else if (!user.emailToken) {
      throw new ConflictException('Usuário ou e-mail já cadastrado!');
    }
    await this.sendConfirmation(user);
    return {
      email: user.email,
      message: 'User created! Please confirm your e-mail',
    };
  }

  async login(
    dto: UserCredentialsDto,
    ignorePasswordValidation?: boolean
  ): Promise<User> {
    const user = await this.userRepository.login(dto, ignorePasswordValidation);
    user.token = await this.getToken(user.id, dto.rememberMe);
    return user;
  }

  async sendConfirmation(user: User): Promise<void> {
    const url = `http://${getHost()}:${getPort()}/api/auth/${
      RoutePath.confirmEmail
    }/${user.id}?${RouteParamTerm.emailToken}=${user.emailToken}`; // TODO url
    await this.mailerService.sendMail({
      to: user.email,
      from: getEnvVar('MAIL'),
      subject: 'Biomercs - Confirm your e-mail',
      template: 'confirmation',
      context: { url },
    });
  }

  async confirmEmail(idUser: number, emailToken: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'emailToken', 'username'],
      where: { id: idUser },
    });
    if (user.emailToken === emailToken) {
      await this.userRepository.update(user.id, { emailToken: null });
      return await this.login({ username: user.username, password: '' }, true);
    } else {
      throw new UnauthorizedException();
    }
  }

  async getToken(id: number, remember: boolean): Promise<string> {
    const options: Entity = {};
    if (remember) {
      options.expiresIn = 16_000_000;
    }
    return await this.jwtService.signAsync({ id }, options);
  }
}
