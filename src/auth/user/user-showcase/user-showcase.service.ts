import { Injectable } from '@nestjs/common';
import { UserShowcaseRepository } from './user-showcase.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserShowcase } from './user-showcase.entity';
import { updateCreatedBy } from '../../../shared/pipes/created-by.pipe';
import { UserShowcaseUpdateDto } from './user-showcase.dto';
import { UpdateResult } from '../../../util/types';

@Injectable()
export class UserShowcaseService {
  constructor(
    @InjectRepository(UserShowcaseRepository)
    private userShowcaseRepository: UserShowcaseRepository
  ) {}

  async add(idUser: number): Promise<UserShowcase> {
    return await this.userShowcaseRepository.save(
      new UserShowcase().extendDto(updateCreatedBy({ idUser }, idUser))
    );
  }

  async update(
    idUserShowcase: number,
    dto: UserShowcaseUpdateDto
  ): Promise<UpdateResult> {
    return await this.userShowcaseRepository.update(idUserShowcase, dto);
  }
}
