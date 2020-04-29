import { EntityRepository, Repository } from 'typeorm';
import { Score } from './score.entity';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  async getTopScore(
    idGame: number,
    idMode: number,
    idType: number,
    idPlatform: number,
    idCharacter: number
  ): Promise<Score> {
    const qb = this.createQueryBuilder('score')
      .innerJoinAndSelect('score.gameModePlatform', 'plat')
      .innerJoinAndSelect('plat.gameMode', 'gameMode')
      .innerJoinAndSelect('score.scorePlayers', 'player')
      .andWhere('plat.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gameMode.idGame = :idGame', { idGame })
      .andWhere('gameMode.idMode = :idMode', { idMode })
      .andWhere('score.idType = :idType', { idType })
      .andWhere('player.idCharacter = :idCharacter', { idCharacter });
    return qb.getOne();
  }
}
