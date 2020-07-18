import { User } from './user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repository';
import { PlayerService } from '../player/player.service';
import { PlayerShowcaseService } from '../player/player-showcase/player-showcase.service';
import { randomInt } from '../util/util';

export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private userRoleService: UserRoleService,
    private roleService: RoleService,
    private playerShowcaseService: PlayerShowcaseService,
    private playerService: PlayerService
  ) {}

  async register(dto: UserRegisterDto): Promise<UserRegisterViewModel> {
    let user = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
      select: ['id', 'email'],
    });
    if (!user) {
      user = await this.userRepository.register(dto);
    } else {
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
    const code = await this.generateCode(user.id);
    await this.mailerService.sendMail({
      to: user.email,
      from: environment.get('MAIL'),
      subject: 'Biomercs - Confirmation code',
      template: 'confirmation-code',
      context: {
        code,
        version: environment.appVersion,
        year: new Date().getFullYear(),
      },
    });
  }

  private async generateCode(idUser: number): Promise<number> {
    const code = randomInt(100000, 999999);
    if (await this.userRepository.exists({ confirmationCode: code })) {
      return await this.generateCode(idUser);
    }
    await this.userRepository.update(idUser, { confirmationCode: code });
    return code;
  }

  async confirmEmail(code: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'confirmationCode', 'username'],
      where: { confirmationCode: code },
    });
    if (!user) {
      throw new UnauthorizedException();
    } else {
      await this.userRepository.update(user.id, { confirmationCode: null });
      const userRole = await this.roleService.findByName(RoleEnum.user);
      await this.userRoleService.add(
        updateCreatedBy({ idUser: user.id, idRole: userRole.id }, user)
      );
      const player = await this.playerService.add(
        updateCreatedBy(
          {
            idUser: user.id,
            personaName: user.username,
          },
          user
        )
      );
      await this.playerShowcaseService.add(player.id, user.id);
      return await this.login({ username: user.username, password: '' }, true);
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
      where: { email },
      select: ['id', 'password', 'salt', 'email'],
    });
    if (user) {
      const code = await this.generateCode(user.id);
      await this.mailerService.sendMail({
        to: user.email,
        from: environment.get('MAIL'),
        subject: 'Biomercs - Confirmation code',
        template: 'confirmation-code',
        context: {
          code,
          version: environment.appVersion,
          year: new Date().getFullYear(),
        },
      });
    }
    return 'An e-mail was sent with the code';
  }

  async confirmForgotPassword(code: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { confirmationCode: code },
      select: ['confirmationCode'],
    });
    return user?.confirmationCode === code;
  }

  async resetPassword(idUser: number): Promise<void> {
    const user = await this.userRepository.findOne(idUser, {
      select: ['id', 'email', 'salt', 'password'],
    });
    const newPassword = Math.random()
      .toString(36)
      .slice(-8);
    const newHash = await hash(newPassword, user.salt);
    await this.userRepository.update(idUser, {
      password: newHash,
      expired: true,
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
      expired: false,
      confirmationCode: null,
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

  async findUserByCode(code: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { confirmationCode: code },
    });
  }
}
