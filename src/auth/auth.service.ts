import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RouteParamTerm, RoutePath } from '../shared/types/route-enums';
import { environment } from '../shared/env/env';
import { Entity } from '../util/types';
import { UserRoleService } from './user/user-role/user-role.service';
import { RoleService } from './role/role.service';
import { RoleEnum } from './role/role.enum';
import { updateCreatedBy } from '../shared/pipes/created-by.pipe';
import { hash } from 'bcryptjs';
import {
  UserCredentialsDto,
  UserRegisterDto,
  UserRegisterViewModel,
} from './user/user.dto';

export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private userRoleService: UserRoleService,
    private roleService: RoleService
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
    user.token = await this.getToken(user);
    return user.removePasswordAndSalt();
  }

  async sendConfirmation(user: User): Promise<void> {
    const url = `http://${environment.host}:${environment.port}/api/auth/${RoutePath.confirmEmail}/${user.id}?${RouteParamTerm.emailToken}=${user.emailToken}`; // TODO url
    await this.mailerService.sendMail({
      to: user.email,
      from: environment.get('MAIL'),
      subject: 'Biomercs - Confirm your e-mail',
      template: 'confirmation',
      context: { url, btnText: 'Click here to confirm' },
    });
  }

  async confirmEmail(idUser: number, emailToken: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'emailToken', 'username'],
      where: { id: idUser },
    });
    if (user.emailToken === emailToken) {
      await this.userRepository.update(user.id, { emailToken: null });
      const userRole = await this.roleService.findByName(RoleEnum.user);
      await this.userRoleService.add(
        updateCreatedBy({ idUser: user.id, idRole: userRole.id }, user)
      );
      return await this.login({ username: user.username, password: '' }, true);
    } else {
      throw new UnauthorizedException();
    }
  }

  async getToken({ id, password, rememberMe }: User): Promise<string> {
    const options: Entity = {};
    if (rememberMe) {
      options.expiresIn = '180 days';
    }
    return await this.jwtService.signAsync({ id, password }, options);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) {
      const resetToken = await hash(user.password, user.salt);
      await this.userRepository.update(user.id, { resetToken });
      const url = `http://localhost:4200/auth/reset-password/${user.id}?${RouteParamTerm.token}=${resetToken}`; // TODO url
      await this.mailerService.sendMail({
        to: user.email,
        from: environment.get('MAIL'),
        subject: 'Biomercs - Reset your password',
        template: 'confirmation',
        context: { url, btnText: 'Click here to reset' },
      });
    }
    return 'An e-mail was sent with instructions';
  }

  async confirmForgotPassword(idUser: number, token: string): Promise<boolean> {
    const user = await this.userRepository.findOne(idUser, {
      select: ['resetToken'],
    });
    return user?.resetToken === token;
  }

  async resetPassword(idUser: number): Promise<void> {
    const user = await this.userRepository.findOne(idUser, {
      select: ['id', 'email', 'salt', 'password'],
    });
    const newPassword = Math.random()
      .toString(36)
      .slice(-8);
    const newHash = await hash(newPassword, user.salt);
    const resetToken = await hash(user.password, user.salt);
    await this.userRepository.update(idUser, {
      password: newHash,
      expired: true,
      resetToken,
    });
    await this.mailerService.sendMail({
      to: user.email,
      from: environment.get('MAIL'),
      subject: 'Biomercs - New password',
      template: 'password',
      context: { password: newPassword },
    });
  }

  async changePassword(idUser: number, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne(idUser, {
      select: ['salt', 'password', 'username'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newPasswordHash = await hash(newPassword, user.salt);
    if (newPasswordHash === user.password) {
      throw new ConflictException(`Password can't be the same as previous`);
    }
    await this.userRepository.update(idUser, {
      password: newPasswordHash,
      resetToken: null,
      expired: false,
    });
    return await this.login(
      {
        username: user.username,
        password: newPassword,
        rememberMe: user.rememberMe,
      },
      true
    );
  }
}
