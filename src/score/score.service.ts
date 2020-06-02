import { Injectable } from '@nestjs/common';
import { Score } from './score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import { ScoreTable } from './score.view-model';
import { CharacterService } from '../game/character/character.service';
import { StageService } from '../game/stage/stage.service';
import { ScoreAddDto, ScoreTopScoreDto } from './score.dto';
import { GameModePlatformService } from '../game/game-mode-platform/game-mode-platform.service';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository,
    private characterService: CharacterService,
    private stageService: StageService,
    private gameModePlatformService: GameModePlatformService,
    private userService: UserService
  ) {}

  async fake(): Promise<void> {
    return;
  }

  async getTopScore(dto: ScoreTopScoreDto): Promise<Score> {
    return await this.scoreRepository.getTopScore(dto);
  }

  async getScoreTablePlayer(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    idPlayer?: number
  ): Promise<ScoreTable[][]> {
    const characters = await this.characterService.findByParams({
      idGame,
      idMode,
    });
    const scores = await Promise.all(
      characters.map(async character => {
        return (
          await this.scoreRepository.getTopScoresStages(
            idPlatform,
            idGame,
            idMode,
            idType,
            character.id,
            idPlayer
          )
        ).map(table => {
          table.character = character;
          return table;
        });
      })
    );
    const wrs = await Promise.all(
      characters.map(async character => {
        return await this.scoreRepository.getTopScoresStages(
          idPlatform,
          idGame,
          idMode,
          idType,
          character.id
        );
      })
    );
    return scores.map((table, index) => {
      return table.map((table1, index1) => {
        const wr = wrs[index][index1];
        table1.isWr =
          table1?.score?.score > 0 &&
          wr?.score?.score > 0 &&
          table1.score.score === wr.score.score;
        if (!table1.isWr) {
          table1.wr = wr.score;
        }
        return table1;
      });
    });
  }

  async getManyTopScore(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    limit = 10,
    idCharacter?: number
  ): Promise<ScoreTable[][]> {
    const idsPlayer = await this.scoreRepository.getTopIdsUser(
      idPlatform,
      idGame,
      idMode,
      idType,
      limit,
      idCharacter
    );
    const players = await this.userService.findByIds(idsPlayer);
    return Promise.all(
      idsPlayer.map(async idPlayer => {
        return (
          await this.scoreRepository.getTopScoresStages(
            idPlatform,
            idGame,
            idMode,
            idType,
            idPlayer,
            idCharacter
          )
        ).map(table => {
          table.player = players.find(player => player.id === idPlayer);
          return table;
        });
      })
    );
  }

  async add({
    idGame,
    idMode,
    idPlatform,
    ...dto
  }: ScoreAddDto): Promise<Score> {
    const idGameModePlatform = await this.gameModePlatformService.findIdByIds(
      idGame,
      idMode,
      idPlatform
    );
    return await this.scoreRepository.save(
      new Score().extendDto({ ...dto, idGameModePlatform } as Score)
    );
  }

  async findById(idScore: number): Promise<Score> {
    return await this.scoreRepository.findOneOrFail(idScore, {
      relations: Score.allRelations,
    });
  }

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }

  async random(): Promise<number> {
    return (
      await this.scoreRepository
        .createQueryBuilder('score')
        .select('score.id')
        .innerJoin('score.gameModePlatform', 'gmp')
        .innerJoin('gmp.gameMode', 'gm')
        .andWhere('gm.idGame = 1')
        .orderBy('rand()')
        .limit(1)
        .getOne()
    ).id;
  }
}
