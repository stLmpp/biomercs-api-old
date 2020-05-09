import { EntityRepository, Repository } from 'typeorm';
import { Mode } from './mode.entity';
import { ModeParamsDto } from './mode.dto';

@EntityRepository(Mode)
export class ModeRepository extends Repository<Mode> {
  async findByParams({
    idGame,
    idPlatform,
    ...dto
  }: ModeParamsDto): Promise<Mode[]> {
    const qb = this.createQueryBuilder('mode');
    if (idGame || idPlatform) {
      qb.innerJoin('mode.gameModes', 'gameMode');
      if (idGame) {
        qb.andWhere('gameMode.idGame = :idGame', { idGame });
      }
      if (idPlatform) {
        qb.innerJoin(
          'gameMode.gameModePlatforms',
          'gmp'
        ).andWhere('gmp.idPlatform = :idPlatform', { idPlatform });
      }
    }
    return this.fillAndWhere('mode', dto, qb).getMany();
  }
}
