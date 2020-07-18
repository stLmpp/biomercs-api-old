import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserUpdateDto } from './user.dto';
import { LikeUppercase } from '../../util/query-operators';
import { FindConditions, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) public userRepository: UserRepository
  ) {}

  async update(idUser: number, dto: UserUpdateDto): Promise<User> {
    if (dto.email && (await this.existsByEmail(dto.email))) {
      throw new ConflictException('E-mail already registered');
    }
    await this.userRepository.update(idUser, { ...dto });
    return await this.findById(idUser);
  }

  async exists(idUser: number): Promise<boolean> {
    return await this.userRepository.exists({ id: idUser });
  }

  async existsByEmail(email: string, idUser?: number): Promise<boolean> {
    const options: FindConditions<User> = { email };
    if (idUser) {
      options.id = Not(idUser);
    }
    return await this.userRepository.exists(options);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.userRepository.exists({ username });
  }

  async findById(idUser: number, relations: string[] = []): Promise<User> {
    return await this.userRepository.findOneOrFail(idUser, {
      relations,
    });
  }

  async search(username: string, email: string): Promise<User[]> {
    const where: FindConditions<User>[] = [];
    if (username) {
      where.push({ username: LikeUppercase(`%${username}%`) });
    }
    if (email) {
      where.push({ email: LikeUppercase(`%${email}%`) });
    }
    return await this.userRepository.find({
      where,
      take: 30,
    });
  }

  async ban(idUser: number): Promise<void> {
    await this.userRepository.softDelete(idUser);
  }

  async completeUser(idUser: number): Promise<User> {
    return await this.userRepository.findOne(idUser, {
      relations: ['player'],
    });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return await this.userRepository.findByIds(ids);
  }
}
