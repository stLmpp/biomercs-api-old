import { EntityRepository, IsNull, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UserCredentialsDto, UserRegisterDto } from './user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(dto: UserRegisterDto): Promise<User> {
    const user = new User().extendDto(dto);
    user.salt = await genSalt();
    user.password = await hash(dto.password, user.salt);
    user.emailToken = await hash(dto.email, user.salt);
    return (await this.save(user)).removePasswordAndSalt();
  }

  async login(
    dto: UserCredentialsDto,
    ignorePasswordValidation?: boolean
  ): Promise<User> {
    const { username, password, rememberMe } = dto;
    const user = await this.findOne({
      where: [
        { username, emailToken: IsNull() },
        { email: username, emailToken: IsNull() },
      ],
      relations: ['userRoles', 'userRoles.role'],
      select: User.all,
    });
    const errorMessage = 'Login or password invalid';
    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }
    if (!ignorePasswordValidation) {
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(errorMessage);
      }
    }
    const lastOnline = new Date();
    await this.update(user.id, { lastOnline, rememberMe, resetToken: null });
    user.lastOnline = lastOnline;
    user.rememberMe = rememberMe;
    return user;
  }
}
