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
  ScoreApprovalParamsDto,
  ScoreAverageDto,
  ScoreIsWrDto,
  ScoreRandomDto,
  ScoreTopScoreDto,
} from './score.dto';
import { GameModePlatformService } from '../game/game-mode-platform/game-mode-platform.service';
import { UserService } from '../auth/user/user.service';
import { GameModeStageService } from '../game/game-mode-stage/game-mode-stage.service';
import { TypeEnum } from '../game/type/type.enum';
import { Pagination } from 'nestjs-typeorm-paginate/index';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { ScoreApprovalService } from './score-approval/score-approval.service';
import { ScoreApprovalStatusEnum } from './score-approval/score-approval-status.enum';
import { updateCreatedBy } from '../shared/pipes/created-by.pipe';
import { updateLastUpdatedBy } from '../shared/pipes/updated-by.pipe';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository,
    private characterService: CharacterService,
    private stageService: StageService,
    private gameModePlatformService: GameModePlatformService,
    private userService: UserService,
    private gameModeStageService: GameModeStageService,
    private scoreApprovalService: ScoreApprovalService
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
    const idScoreStatus =
      dto.idType === TypeEnum.duo
        ? ScoreStatusEnum.pendingUser
        : ScoreStatusEnum.pendingAdmin;
    const score = await this.scoreRepository.save(
      new Score().extendDto({
        ...dto,
        idGameModePlatform,
        idGameModeStage,
        idScoreStatus,
      })
    );
    const requiredApprovalDto: ScoreAverageDto = {
      score: dto.score,
      time: dto.time,
      maxCombo: dto.maxCombo,
      idMode,
      idPlatform,
      idGame,
      idStage,
      idType: dto.idType,
    };
    if (dto.idType === TypeEnum.duo) {
      requiredApprovalDto.idCharacters = dto.scorePlayers.map(
        sp => sp.idCharacter
      );
    } else {
      requiredApprovalDto.idCharacter = dto.scorePlayers[0].idCharacter;
    }
    if (!(await this.requireApproval(requiredApprovalDto))) {
      await this.scoreApprovalService.add(
        updateCreatedBy({
          idScore: score.id,
          description: 'Auto approval',
          status: ScoreApprovalStatusEnum.approved,
        })
      );
      await this.scoreRepository.update(
        score.id,
        updateLastUpdatedBy({ idScoreStatus: ScoreStatusEnum.approved })
      );
    }
    return score;
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
    scoreVw.characterWorldRecords = (
      await Promise.all(
        scoreVw.scorePlayers.map(player =>
          this.getTopScore({
            idPlatform: score.gameModePlatform.idPlatform,
            idType: score.idType,
            idMode: score.gameModePlatform.gameMode.idMode,
            idGame: score.gameModePlatform.gameMode.idGame,
            idStage: score.gameModeStage.idStage,
            idCharacter: player.idCharacter,
          })
        )
      )
    ).filter(charWr => !!charWr);
    scoreVw.isCharacterWorldRecords =
      !scoreVw.characterWorldRecords.length ||
      scoreVw.characterWorldRecords.some(cwr => cwr.id === scoreVw.id);
    scoreVw.isCharacterWorldRecord = scoreVw.scorePlayers.reduce(
      (acc, sp) => ({
        ...acc,
        [sp.idCharacter]:
          !scoreVw.characterWorldRecords.length ||
          scoreVw.characterWorldRecords.some(
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
    scoreVw.isWorldRecord = !wr?.id || wr.id === score.id;
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
      scoreVw.isCombinationWorldRecord =
        !combinationWr?.id || combinationWr.id === score.id;
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
    isWr.characterWorldRecords = !idCharacters?.length
      ? []
      : (
          await Promise.all(
            idCharacters.map(idCharacter =>
              this.getTopScore({
                ...dto,
                idCharacter,
              })
            )
          )
        ).filter(Boolean);
    isWr.isCharacterWorldRecords =
      !isWr.characterWorldRecords?.length ||
      isWr.characterWorldRecords.some(cwr => score >= (cwr?.score ?? 0));
    isWr.isCharacterWorldRecord = (idCharacters ?? []).reduce(
      (acc, idCharacter) => ({
        ...acc,
        [idCharacter]:
          !isWr.characterWorldRecords?.length ||
          (isWr.characterWorldRecords ?? []).some(
            charWr =>
              score >= (charWr?.score ?? 0) &&
              charWr.scorePlayers[0].idCharacter === idCharacter
          ),
      }),
      {}
    );
    if (dto.idType === TypeEnum.duo) {
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

  async findScoresApproval(
    dto: ScoreApprovalParamsDto,
    page: number
  ): Promise<Pagination<ScoreViewModel>> {
    const {
      items,
      links,
      meta,
    } = await this.scoreRepository.findScoresApproval(dto, page);
    return new Pagination(
      await Promise.all(items.map(score => this.fillWr(score))),
      meta,
      links
    );
  }

  async requireApproval(dto: ScoreAverageDto): Promise<boolean> {
    const isWr = await this.isWr(dto);
    if (
      isWr.isWorldRecord ||
      isWr.isCharacterWorldRecords ||
      isWr.isCombinationWorldRecord
    ) {
      return true;
    }
    const averageScore = await this.scoreRepository.findAverage(dto);
    const percent5 = averageScore * 0.05;
    return (
      dto.score < averageScore - percent5 || dto.score > averageScore + percent5
    );
  }
}
