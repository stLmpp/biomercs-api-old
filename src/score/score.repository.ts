import { Connection, EntityRepository, In, Repository } from 'typeorm';
import { Score } from './score.entity';
import { ScoreRandomDto, ScoreTopScoreDto } from './score.dto';
import { Stage } from '../game/stage/stage.entity';
import { ScoreTable } from './score.view-model';
import { plainToClass } from 'class-transformer';
import { ScorePlayer } from './score-player/score-player.entity';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  constructor(private connection: Connection) {
    super();
  }

  async random({
    idCharacter,
    idGame,
    idMode,
    idPlatform,
    idPlayer,
    idStage,
    idType,
  }: ScoreRandomDto): Promise<Score> {
    const qb = this.createQueryBuilder('score')
      .select('score.id')
      .innerJoin('score.gameModePlatform', 'gmp')
      .innerJoin('gmp.gameMode', 'gm')
      .innerJoin('score.scorePlayers', 'sp')
      .orderBy('rand()');
    if (idPlatform) {
      qb.andWhere('gmp.idPlatform = :idPlatform', { idPlatform });
    }
    if (idGame) {
      qb.andWhere('gm.idGame = :idGame', { idGame });
    }
    if (idMode) {
      qb.andWhere('gm.idMode = :idMode', { idMode });
    }
    if (idPlayer) {
      qb.andWhere('sp.idPlayer = :idPlayer', { idPlayer });
    }
    if (idCharacter) {
      qb.andWhere('sp.idCharacter = :idCharacter', { idCharacter });
    }
    if (idStage) {
      qb.andWhere('score.idStage = :idStage', { idStage });
    }
    if (idType) {
      qb.andWhere('score.idType = :idType', { idType });
    }
    return qb.getOne();
  }

  async getTopScoresStages(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    idCharacter?: number,
    idPlayer?: number
  ): Promise<ScoreTable[]> {
    const qb = this.connection
      .createQueryBuilder()
      .from(Stage, 'stg')
      .addSelect('stg.*')
      .andWhere('stg.idGame = :idGame', { idGame })
      .leftJoin(
        subQuery => {
          subQuery
            .from(Score, 'score')
            .innerJoin('score.scorePlayers', 'score_player')
            .innerJoin('score.gameModePlatform', 'gmp')
            .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
            .innerJoin('gmp.gameMode', 'gm')
            .andWhere('gm.idGame = :idGame', { idGame })
            .andWhere('gm.idMode = :idMode', { idMode })
            .andWhere('score.idType = :idType', { idType })
            .addSelect('score.idStage', 'idStage')
            .addSelect('max(score.score)', 'maxScore')
            .addGroupBy('idStage');
          if (idCharacter) {
            subQuery.andWhere('score_player.idCharacter = :idCharacter', {
              idCharacter,
            });
          }
          if (idPlayer) {
            subQuery.andWhere('score_player.idPlayer = :idPlayer', {
              idPlayer,
            });
          }
          return subQuery;
        },
        't',
        't.idStage = stg.id'
      )
      .leftJoin(
        Score,
        'score',
        'stg.id = score.idStage and score.score = t.maxScore'
      )
      .addSelect('score.id', 'idScore')
      .orderBy('stg.id');
    const rawStages = await qb.getRawMany();
    const scoreIds = rawStages
      .filter(stage => stage?.idScore)
      .map(({ idScore }) => idScore);
    const scores = scoreIds.length
      ? await this.find({
          where: { id: In(scoreIds) },
        })
      : [];
    return rawStages.map(raw => ({
      stage: plainToClass(Stage, raw),
      score: scores.find(score => score.id === raw.idScore),
    }));
  }

  async getTopScore({
    idStage,
    idGame,
    idMode,
    idCharacters,
    idCharacter,
    idPlayer,
    idType,
    idPlatform,
    idCharactersAnd,
  }: ScoreTopScoreDto): Promise<Score> {
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
      .innerJoinAndSelect('p.player', 'player')
      .innerJoinAndSelect('p.character', 'c');
    if (idCharacter) {
      qb.andWhere('p.idCharacter = :idCharacter', { idCharacter });
    }
    if (idPlayer) {
      qb.andWhere('player.id = :idPlayer', { idPlayer });
    }
    if (idCharacters?.length) {
      if (idCharactersAnd) {
        for (let i = 0, len = idCharacters.length; i < len; i++) {
          const id = idCharacters[i];
          qb.andExists(sb => {
            sb.from(ScorePlayer, 'spsb')
              .andWhere('spsb.idScore = score.id')
              .andWhere(`spsb.idCharacter = :i${i}`, { ['i' + i]: id });
            const otherIds = idCharacters.filter((_, index) => index !== i);
            for (let j = 0, len = otherIds.length; j < len; j++) {
              sb.andExists(sb1 =>
                sb1
                  .from(ScorePlayer, 'spsb2')
                  .andWhere('spsb2.idScore = score.id')
                  .andWhere(`spsb2.idCharacter = :i${i}j${j}`, {
                    [`i${i}j${j}`]: otherIds[j],
                  })
                  .andWhere('spsb2.id != spsb.id')
              );
            }
            return sb;
          });
        }
      } else {
        qb.andWhere('p.idCharacter in (:...idCharacters)', { idCharacters });
      }
    }
    return qb
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
