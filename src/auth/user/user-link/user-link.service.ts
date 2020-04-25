import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLinkRepository } from './user-link.repository';
import { UserLinkAddDto } from './dto/add.dto';
import { UserLink } from './user-link.entity';
import { DeleteResult, UpdateResult } from '../../../util/types';
import { UserLinkUpdateDto } from './dto/update.dto';

@Injectable()
export class UserLinkService {
  constructor(
    @InjectRepository(UserLinkRepository)
    private userLinkRepository: UserLinkRepository
  ) {}

  async add(idUser: number, dto: UserLinkAddDto): Promise<UserLink> {
    return await this.userLinkRepository.save(
      new UserLink().extendDto({ ...dto, idUser })
    );
  }

  async addMany(idUser: number, dto: UserLinkAddDto[]): Promise<UserLink[]> {
    return await this.userLinkRepository.save(
      dto.map(userLink => new UserLink().extendDto({ ...userLink, idUser }))
    );
  }

  async delete(idUserLink: number): Promise<DeleteResult> {
    return await this.userLinkRepository.delete(idUserLink);
  }

  async update(
    idUserLink: number,
    dto: UserLinkUpdateDto
  ): Promise<UpdateResult> {
    return await this.userLinkRepository.update(idUserLink, dto);
  }
}
