import { Injectable } from '@nestjs/common';
import { UserShowcaseRepository } from './user-showcase.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserShowcase } from './user-showcase.entity';
import { updateCreatedBy } from '../../../shared/pipes/created-by.pipe';
import { UserShowcaseUpdateDto } from './user-showcase.dto';

@Injectable()
export class UserShowcaseService {
  constructor(
    @InjectRepository(UserShowcaseRepository)
    private userShowcaseRepository: UserShowcaseRepository
  ) {}

  async add(idUser: number): Promise<UserShowcase> {
    return await this.userShowcaseRepository.save(
      new UserShowcase().extendDto(
        updateCreatedBy(
          { idUser, idPlatform: 1, idGame: 1, idMode: 1, idType: 1 },
          idUser
        )
      )
    );
  }

  async update(
    id: number,
    dto: UserShowcaseUpdateDto,
    property: keyof UserShowcase = 'id'
  ): Promise<UserShowcase> {
    await this.userShowcaseRepository.update({ [property]: id }, dto);
    return await this.userShowcaseRepository.findOne({
      where: { [property]: id },
    });
  }

  async findByIdUser(idUser: number): Promise<UserShowcase> {
    return await this.userShowcaseRepository.findOne({ where: { idUser } });
  }
}
