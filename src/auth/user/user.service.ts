import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UpdateResult } from '../../util/types';
import { UserUpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async update(idUser: number, dto: UserUpdateDto): Promise<UpdateResult> {
    return await this.userRepository.update(idUser, { ...dto });
  }

  async exists(idUser: number): Promise<boolean> {
    return await this.userRepository.exists({ id: idUser });
  }
}
