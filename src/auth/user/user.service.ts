import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UpdateResult } from '../../util/types';
import { UserUpdateDto } from './dto/update.dto';

export interface MyRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private request: MyRequest,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  get user(): User {
    return this.request.user ?? ({ id: -1 } as User);
  }

  async update(idUser: number, dto: UserUpdateDto): Promise<UpdateResult> {
    return await this.userRepository.update(idUser, { ...dto });
  }

  async exists(idUser: number): Promise<boolean> {
    return await this.userRepository.exists({ id: idUser });
  }
}
