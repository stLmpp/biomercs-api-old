import { EntityRepository, Repository } from 'typeorm';
import { GameModePlatform } from './game-mode-platform.entity';

@EntityRepository(GameModePlatform)
export class GameModePlatformRepository extends Repository<GameModePlatform> {
  async findIdByIds(
    idGame: number,
    idMode: number,
    idPlatform: number
  ): Promise<number> {
    return (
      await this.createQueryBuilder('gmp')
        .select('gmp.id')
        .innerJoin('gmp.gameMode', 'gm')
        .andWhere('gm.idGame = :idGame', { idGame })
        .andWhere('gm.idMode = :idMode', { idMode })
        .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
        .getOne()
    ).id;
  }
}
