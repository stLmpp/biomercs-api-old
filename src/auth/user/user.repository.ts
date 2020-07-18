import { EntityRepository, FindConditions, Repository } from 'typeorm';
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
    return (await this.save(user)).removePasswordAndSalt();
  }

  async login(
    dto: UserCredentialsDto,
    ignorePasswordValidation?: boolean
  ): Promise<User> {
    const { username, password, rememberMe } = dto;
    const where: FindConditions<User>[] = [{ username }, { email: username }];
    const user = await this.findOne({
      where,
      relations: ['userRoles', 'userRoles.role'],
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
    const update: Partial<User> = { lastOnline, rememberMe };
    await this.update(user.id, update);
    user.lastOnline = lastOnline;
    user.rememberMe = rememberMe;
    return user;
  }
}
