import {
  Connection,
  EntityRepository,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Score } from './score.entity';
import {
  ScoreApprovalParamsDto,
  ScoreAverageDto,
  ScoreRandomDto,
  ScoreTopScoreDto,
} from './score.dto';
import { Stage } from '../game/stage/stage.entity';
import { ScoreTable } from './score.view-model';
import { plainToClass } from 'class-transformer';
import { ScorePlayer } from './score-player/score-player.entity';
import { GameModeStage } from '../game/game-mode-stage/game-mode-stage.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate/index';
import { environment } from '../shared/env/env';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { OrderByDirection } from '../util/types';
import { isString } from 'is-what';
import { JoinType } from '../util/util';

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
      .innerJoin('score.gameModeStage', 'gms')
      .andWhere('gms.idGameMode = gmp.idGameMode')
      .innerJoin('score.scorePlayers', 'sp')
      .andWhere('score.idScoreStatus = :idScoreStatus', {
        idScoreStatus: ScoreStatusEnum.approved,
      })
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
      qb.andWhere('gms.idStage = :idStage', { idStage });
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
      .createQueryBuilder(GameModeStage, 'gms')
      .innerJoin('gms.stage', 'stg')
      .innerJoin('gms.gameMode', 'gm')
      .select('stg.*')
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMode = :idMode', { idMode })
      .leftJoin(
        subQuery => {
          subQuery
            .from(Score, 'score')
            .innerJoin('score.scorePlayers', 'score_player')
            .innerJoin('score.gameModePlatform', 'gmp')
            .innerJoin('score.gameModeStage', 'gms')
            .innerJoin('gmp.gameMode', 'gm')
            .andWhere('gms.idGameMode = gmp.idGameMode')
            .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
            .andWhere('gm.idGame = :idGame', { idGame })
            .andWhere('gm.idMode = :idMode', { idMode })
            .andWhere('score.idType = :idType', { idType })
            .andWhere('score.idScoreStatus = :idScoreStatus', {
              idScoreStatus: ScoreStatusEnum.approved,
            })
            .addSelect('gms.id', 'idGameModeStage')
            .addSelect('max(score.score)', 'maxScore')
            .addGroupBy('idGameModeStage');
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
        't.idGameModeStage = gms.id'
      )
      .leftJoin(
        Score,
        'score',
        'score.score = t.maxScore and score.idGameModeStage = gms.id'
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

  private includeCharacters(
    [score, player]: [string, string],
    qb: SelectQueryBuilder<Score>,
    {
      idCharacter,
      idCharacters,
      idCharactersAnd,
    }: Pick<
      ScoreTopScoreDto,
      'idCharacter' | 'idCharactersAnd' | 'idCharacters'
    >
  ): SelectQueryBuilder<Score> {
    if (idCharacter) {
      qb.andWhere(`${player}.idCharacter = :idCharacter`, { idCharacter });
    }
    if (idCharacters?.length) {
      if (idCharactersAnd) {
        for (let i = 0, len = idCharacters.length; i < len; i++) {
          const id = idCharacters[i];
          qb.andExists(sb => {
            sb.from(ScorePlayer, 'spsb')
              .andWhere(`spsb.idScore = ${score}.id`)
              .andWhere(`spsb.idCharacter = :i${i}`, { ['i' + i]: id });
            const otherIds = idCharacters.filter((_, index) => index !== i);
            for (let j = 0, len2 = otherIds.length; j < len2; j++) {
              sb.andExists(sb1 =>
                sb1
                  .from(ScorePlayer, 'spsb2')
                  .andWhere(`spsb2.idScore = ${score}.id`)
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
        qb.andWhere(`${player}.idCharacter in (:...idCharacters)`, {
          idCharacters,
        });
      }
    }
    return qb;
  }

  async getTopScore({
    idStage,
    idGame,
    idMode,
    idPlayer,
    idType,
    idPlatform,
    ...character
  }: ScoreTopScoreDto): Promise<Score> {
    const qb = this.createQueryBuilder('score')
      .innerJoinAndSelect('score.gameModeStage', 'gms')
      .andWhere('gms.idGameMode = gmp.idGameMode')
      .innerJoinAndSelect('gms.stage', 'stage')
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
      .innerJoinAndSelect('p.character', 'c')
      .innerJoinAndSelect('score.scoreStatus', 'ss')
      .andWhere('ss.id = :idScoreStatus', {
        idScoreStatus: ScoreStatusEnum.approved,
      });
    if (idPlayer) {
      qb.andWhere('player.id = :idPlayer', { idPlayer });
    }
    this.includeCharacters(['score', 'p'], qb, character);
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
          .innerJoin('score.gameModeStage', 'gms')
          .andWhere('gms.idGameMode = gmp.idGameMode')
          .addSelect('gms.idStage', 'idStage')
          .addSelect('player.idPlayer', 'idPlayer')
          .addSelect('max(score.score)', 'maxScore')
          .andWhere('score.idType = :idType', { idType })
          .innerJoin('score.gameModePlatform', 'gmp')
          .andWhere('gmp.idPlatform = :idPlatform', { idPlatform })
          .innerJoin('gmp.gameMode', 'gm')
          .andWhere('gm.idGame = :idGame', { idGame })
          .andWhere('gm.idMode = :idMode', { idMode })
          .innerJoin('score.scorePlayers', 'player')
          .andWhere('score.idScoreStatus = :idScoreStatus', {
            idScoreStatus: ScoreStatusEnum.approved,
          })
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

  private includeAllRelations(
    tableName: string,
    qb: SelectQueryBuilder<Score>,
    join?: Record<string, JoinType>
  );
  private includeAllRelations(
    tableName: string,
    qb: SelectQueryBuilder<Score>,
    join?: JoinType
  ): SelectQueryBuilder<Score>;
  private includeAllRelations(
    tableName: string,
    qb: SelectQueryBuilder<Score>,
    join: JoinType | Record<string, JoinType> = 'innerJoinAndSelect'
  ): SelectQueryBuilder<Score> {
    let joinOptions: Record<string, JoinType>;
    if (isString(join)) {
      joinOptions = Score.allRelationQb.reduce(
        (obj, item) => ({ ...obj, [item]: join }),
        {}
      );
    } else {
      joinOptions = Score.allRelationQb.reduce(
        (obj, item) => ({ ...obj, [item]: join[item] ?? 'innerJoinAndSelect' }),
        {}
      );
    }
    return qb[joinOptions.gameModePlatform](
      `${tableName}.gameModePlatform`,
      'gmp'
    )
      [joinOptions.gameMode]('gmp.gameMode', 'gm')
      [joinOptions.game]('gm.game', 'g')
      [joinOptions.mode]('gm.mode', 'm')
      [joinOptions.platform]('gmp.platform', 'p')
      [joinOptions.gameModeStage](`${tableName}.gameModeStage`, 'gms')
      .andWhere('gms.idGameMode = gmp.idGameMode')
      [joinOptions.stage]('gms.stage', 's')
      [joinOptions.type](`${tableName}.type`, 't')
      [joinOptions.scorePlayers](`${tableName}.scorePlayers`, 'sp')
      [joinOptions.player]('sp.player', 'pl')
      [joinOptions.character]('sp.character', 'c')
      [joinOptions.scorePlayerProofs.replace('inner', 'left')](
        'sp.scorePlayerProofs',
        'spp'
      )
      [joinOptions.site.replace('inner', 'left')]('spp.site', 'site')
      [joinOptions.scoreStatus]('score.scoreStatus', 'ss');
  }

  private scoresApprovalQb(
    {
      endDate,
      idGame,
      idMode,
      idPlatform,
      idPlayer,
      idType,
      startDate,
      idScoreStatus,
      idStage,
      idCharacter,
      idStages,
    }: ScoreApprovalParamsDto,
    orderBy?: string,
    orderByDirection?: OrderByDirection
  ): SelectQueryBuilder<Score> {
    const qb = this.createQueryBuilder('score').orderBy(
      `${orderBy ?? 'score.id'}`,
      orderByDirection ?? 'ASC'
    );
    this.includeAllRelations('score', qb, {
      game: 'innerJoin',
      mode: 'innerJoin',
      platform: 'innerJoin',
      type: 'innerJoin',
    });
    if (idScoreStatus) {
      qb.andWhere('score.idScoreStatus = :idScoreStatus', { idScoreStatus });
    }
    if (idGame) {
      qb.andWhere('g.id = :idGame', { idGame });
    }
    if (idPlatform) {
      qb.andWhere('p.id = :idPlatform', { idPlatform });
    }
    if (idMode) {
      qb.andWhere('m.id = :idMode', { idMode });
    }
    if (idPlayer) {
      qb.andExists(sb => {
        sb.from(ScorePlayer, 'spExists')
          .andWhere('spExists.idScore = score.id')
          .andWhere('spExists.idPlayer = :idPlayer', { idPlayer });
        if (
          [ScoreStatusEnum.pendingUser, ScoreStatusEnum.rejectedUser].includes(
            idScoreStatus
          )
        ) {
          sb.andWhere(() => {
            const sbb = qb
              .subQuery()
              .select('max(maxSp.id)', 'maxId')
              .from(ScorePlayer, 'maxSp')
              .andWhere('spExists.idScore = maxSp.idScore');
            return `spExists.id = ${sbb.getQuery()}`;
          });
        }
        return sb;
      });
    }
    if (idType) {
      qb.andWhere('t.id = :idType', { idType });
    }
    if (startDate) {
      qb.andWhere('score.creationDate > :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('score.creationDate < :endDate', { endDate });
    }
    if (idStage) {
      qb.andWhere('gms.idStage = :idStage', { idStage });
    }
    if (idStages) {
      qb.andWhere('gms.idStages in ...:idStages', { idStages });
    }
    if (idCharacter) {
      qb.andExists(sb => {
        return sb
          .from(ScorePlayer, 'charExists')
          .andWhere('charExists.idScore = score.id')
          .andWhere('charExists.idCharacter = :idCharacter', { idCharacter });
      });
    }
    return qb;
  }

  async findScoresApproval(
    dto: ScoreApprovalParamsDto,
    page: number,
    orderBy?: string,
    orderByDirection?: OrderByDirection
  ): Promise<Pagination<Score>> {
    const qb = this.scoresApprovalQb(dto, orderBy, orderByDirection);
    return await paginate(qb, {
      page,
      limit: environment.defaultPaginationSize,
    });
  }

  async countScoresApproval(dto: ScoreApprovalParamsDto): Promise<number> {
    return await this.scoresApprovalQb(dto).getCount();
  }

  async findAverage({
    idMode,
    idPlatform,
    idGame,
    idStage,
    idType,
    idCharacters,
    idCharactersAnd,
    idCharacter,
    maxCombo,
    time,
  }: ScoreAverageDto): Promise<number> {
    const qb = this.createQueryBuilder('score');
    this.includeAllRelations('score', qb, 'innerJoin')
      .andWhere('p.id = :idPlatform', { idPlatform })
      .andWhere('g.id = :idGame', { idGame })
      .andWhere('m.id = :idMode', { idMode })
      .andWhere('t.id = :idType', { idType })
      .andWhere('s.id = :idStage', { idStage })
      .andWhere('ss.id = :idScoreStatus', {
        idScoreStatus: ScoreStatusEnum.approved,
      });
    this.includeCharacters(['score', 'sp'], qb, {
      idCharactersAnd,
      idCharacter,
      idCharacters,
    });
    qb.andWhere(
      'score.maxCombo between :maxCombo - 10 and least(:maxCombo + 10, gms.maxCombo)',
      { maxCombo }
    ).andWhere(
      `(${formatTime('score.time')}) between (${formatTime(
        ':time'
      )}) - (15 * 100) and (${formatTime(':time')}) + (15 * 100)`,
      { time }
    );
    const count = await qb.clone().getCount();
    return count < 20
      ? 0
      : (await qb.select('avg(score.score)', 'avgScore').getRawOne()).avgScore;
  }
}

export function formatTime(time: string): string {
  return `(substr(${time}, 1, 2) * 100 * 60) + (substr(${time}, 4, 2) * 100) + substr(${time}, 7, 2)`;
}
