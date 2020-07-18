import { Injectable } from '@nestjs/common';
import { PlayerShowcaseRepository } from './player-showcase.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerShowcase } from './player-showcase.entity';
import { PlayerShowcaseUpdateDto } from './player-showcase.dto';
import { updateCreatedBy } from '../../shared/pipes/created-by.pipe';

@Injectable()
export class PlayerShowcaseService {
  constructor(
    @InjectRepository(PlayerShowcaseRepository)
    private playerShowcaseRepository: PlayerShowcaseRepository
  ) {}

  async add(idPlayer: number, idUser: number): Promise<PlayerShowcase> {
    return await this.playerShowcaseRepository.save(
      new PlayerShowcase().extendDto(
        updateCreatedBy(
          { idPlayer, idPlatform: 1, idGame: 1, idMode: 1, idType: 1 },
          idUser
        )
      )
    );
  }

  async update(
    id: number,
    dto: PlayerShowcaseUpdateDto,
    property: keyof PlayerShowcase = 'id'
  ): Promise<PlayerShowcase> {
    await this.playerShowcaseRepository.update({ [property]: id }, dto);
    return await this.playerShowcaseRepository.findOne({
      where: { [property]: id },
    });
  }

  async findByPlayer(idPlayer: number): Promise<PlayerShowcase> {
    return await this.playerShowcaseRepository.findOne({ where: { idPlayer } });
  }
}
