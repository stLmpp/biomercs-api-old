import { EntityRepository, IsNull, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/register.dto';
import { UserCredentialsDto } from './dto/credentials.dto';

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
    });
    const errorMessage = 'Login ou senha inválidos';
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
    await this.update(user.id, { lastOnline, rememberMe });
    user.lastOnline = lastOnline;
    user.rememberMe = rememberMe;
    return user.removePasswordAndSalt();
  }
}
