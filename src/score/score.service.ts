import { Injectable } from '@nestjs/common';
import { Score } from './score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import {
  ScoreIsWrViewModel,
  ScoreTable,
  ScoreViewModel,
} from './score.view-model';
import { CharacterService } from '../game/character/character.service';
import { StageService } from '../game/stage/stage.service';
import {
  ScoreAddDto,
  ScoreIsWrDto,
  ScoreRandomDto,
  ScoreTopScoreDto,
} from './score.dto';
import { GameModePlatformService } from '../game/game-mode-platform/game-mode-platform.service';
import { UserService } from '../auth/user/user.service';
import { GameModeStageService } from '../game/game-mode-stage/game-mode-stage.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository,
    private characterService: CharacterService,
    private stageService: StageService,
    private gameModePlatformService: GameModePlatformService,
    private userService: UserService,
    private gameModeStageService: GameModeStageService
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
    return await Promise.all(
      characters.map(async character =>
        (
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
        })
      )
    );
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
    idStage,
    ...dto
  }: ScoreAddDto): Promise<Score> {
    const idGameModePlatform = await this.gameModePlatformService.findIdByIds(
      idGame,
      idMode,
      idPlatform
    );
    const idGameModeStage = await this.gameModeStageService.findIdByIds(
      idGame,
      idMode,
      idStage
    );
    return await this.scoreRepository.save(
      new Score().extendDto({
        ...dto,
        idGameModePlatform,
        idGameModeStage,
      } as Score)
    );
  }

  async findById(idScore: number): Promise<ScoreViewModel> {
    return await this.fillWr(
      await this.scoreRepository.findOneOrFail(idScore, {
        relations: Score.allRelations,
      })
    );
  }

  async fillWr(score: Score): Promise<ScoreViewModel> {
    const scoreVw = new ScoreViewModel().extendDto(score);
    scoreVw.characterWorldRecords = await Promise.all(
      scoreVw.scorePlayers.map(
        async player =>
          await this.getTopScore({
            idPlatform: score.gameModePlatform.idPlatform,
            idType: score.idType,
            idMode: score.gameModePlatform.gameMode.idMode,
            idGame: score.gameModePlatform.gameMode.idGame,
            idStage: score.gameModeStage.idStage,
            idCharacter: player.idCharacter,
          })
      )
    );
    scoreVw.isCharacterWorldRecords = scoreVw.characterWorldRecords.some(
      cwr => cwr.id === scoreVw.id
    );
    scoreVw.isCharacterWorldRecord = scoreVw.scorePlayers.reduce(
      (acc, sp) => ({
        ...acc,
        [sp.idCharacter]: scoreVw.characterWorldRecords.some(
          charWr =>
            charWr.id === sp.idScore &&
            charWr.scorePlayers[0].idCharacter === sp.idCharacter
        ),
      }),
      {}
    );
    const wr = await this.getTopScore({
      idPlatform: score.gameModePlatform.idPlatform,
      idType: score.idType,
      idMode: score.gameModePlatform.gameMode.idMode,
      idGame: score.gameModePlatform.gameMode.idGame,
      idStage: score.gameModeStage.idStage,
    });
    scoreVw.isWorldRecord = wr.id === score.id;
    scoreVw.wordRecord = wr;
    if (score.idType === 2) {
      const combinationWr = await this.getTopScore({
        idPlatform: score.gameModePlatform.idPlatform,
        idType: score.idType,
        idMode: score.gameModePlatform.gameMode.idMode,
        idGame: score.gameModePlatform.gameMode.idGame,
        idStage: score.gameModeStage.idStage,
        idCharacters: score.scorePlayers.map(sp => sp.idCharacter),
        idCharactersAnd: true,
      });
      scoreVw.isCombinationWorldRecord = combinationWr.id === score.id;
      scoreVw.combinationWorldRecord = combinationWr;
    }
    return scoreVw;
  }

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }

  async random(dto: ScoreRandomDto): Promise<number> {
    return (await this.scoreRepository.random(dto)).id;
  }
  async isWr({
    score,
    idCharacters,
    ...dto
  }: ScoreIsWrDto): Promise<ScoreIsWrViewModel> {
    const isWr = new ScoreIsWrViewModel();
    isWr.wordRecord = await this.getTopScore(dto);
    isWr.isWorldRecord = score >= (isWr.wordRecord?.score ?? 0);
    isWr.characterWorldRecords = await Promise.all(
      idCharacters.map(
        async idCharacter =>
          await this.getTopScore({
            ...dto,
            idCharacter,
          })
      )
    );
    // TODO fix no character world records found
    isWr.isCharacterWorldRecords = isWr.characterWorldRecords.some(
      cwr => score >= (cwr?.score ?? 0)
    );
    isWr.isCharacterWorldRecord = idCharacters.reduce(
      (acc, idCharacter) => ({
        ...acc,
        [idCharacter]: isWr.characterWorldRecords.some(
          charWr =>
            score >= (charWr?.score ?? 0) &&
            charWr.scorePlayers[0].idCharacter === idCharacter
        ),
      }),
      {}
    );
    if (dto.idType === 2) {
      isWr.combinationWorldRecord = await this.getTopScore({
        ...dto,
        idCharacters,
        idCharactersAnd: true,
      });
      isWr.isCombinationWorldRecord =
        score >= (isWr.combinationWorldRecord?.score ?? 0);
    }
    return isWr;
  }
}
