import {
  Connection,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Score } from './score.entity';
import { ScoreTopScoreDto } from './score.dto';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  constructor(private connection: Connection) {
    super();
  }

  private getTopScoreQueryBuilder({
    idType,
    idStage,
    idPlayer,
    idPlatform,
    idMode,
    idGame,
    idCharacter,
  }: ScoreTopScoreDto): SelectQueryBuilder<Score> {
    const qb = this.createQueryBuilder('score')
      .innerJoinAndSelect('score.stage', 'stage')
      .andWhere('stage.id = :idStage', { idStage })
      .innerJoinAndSelect('score.type', 'type')
      .andWhere('type.id = :idType', { idType })
      .innerJoinAndSelect('score.gameModePlatform', 'gmp')
      .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
      .innerJoinAndSelect('gmp.gameMode', 'gm')
      .innerJoinAndSelect('gm.game', 'game')
      .andWhere('gm.idGame = :idGame', { idGame })
      .innerJoinAndSelect('gm.mode', 'mode')
      .andWhere('gm.idMode = :idMode', { idMode })
      .innerJoinAndSelect('score.scorePlayers', 'p')
      .innerJoinAndSelect('p.player', 'player');
    if (idCharacter) {
      qb.andWhere('p.idCharacter = :idCharacter', { idCharacter });
    }
    if (idPlayer) {
      qb.andWhere('player.id = :idPlayer', { idPlayer });
    }
    return qb;
  }

  async getTopScore(dto: ScoreTopScoreDto): Promise<Score> {
    return this.getTopScoreQueryBuilder(dto)
      .andWhere(sbq => {
        const newSub = sbq.clone().select('MAX(score.score)', 'maxScore');
        return `score.score = (${newSub.getQuery()})`;
      })
      .getOne();
  }

  async getTopIdsUser(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    limit = 10,
    idCharacter?: number
  ): Promise<number[]> {
    const qb = this.connection
      .createQueryBuilder()
      .from(subQuery => {
        subQuery
          .from(Score, 'score')
          .addSelect('score.idStage', 'idStage')
          .addSelect('player.idPlayer', 'idPlayer')
          .addSelect('max(score.score)', 'maxScore')
          .andWhere('score.idType = :idType', { idType })
          .innerJoin('score.gameModePlatform', 'gmp')
          .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
          .innerJoin('gmp.gameMode', 'gm')
          .andWhere('gm.idGame = :idGame', { idGame })
          .andWhere('gm.idMode = :idMode', { idMode })
          .innerJoin('score.scorePlayers', 'player')
          .addGroupBy('idStage')
          .addGroupBy('idPlayer');
        if (idCharacter) {
          subQuery.andWhere('player.idCharacter = :idCharacter', {
            idCharacter,
          });
        }
        return subQuery;
      }, 't')
      .addSelect('idPlayer')
      .addSelect('sum(maxScore)', 'sumScore')
      .groupBy('idPlayer')
      .orderBy('sumScore', 'DESC')
      .limit(limit);
    const result = await qb.getRawMany();
    return result.map(({ idPlayer }) => idPlayer);
  }
}
