import { Injectable } from '@nestjs/common';
import { Score } from './score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import { ScoreTable } from './score.view-model';
import { CharacterService } from '../game/character/character.service';
import { StageService } from '../game/stage/stage.service';
import { ScoreAddDto, ScoreTopScoreDto } from './score.dto';
import { GameModePlatformService } from '../game/game-mode-platform/game-mode-platform.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository,
    private characterService: CharacterService,
    private stageService: StageService,
    private gameModePlatformService: GameModePlatformService
  ) {}

  async getTopScore(dto: ScoreTopScoreDto): Promise<Score> {
    return await this.scoreRepository.getTopScore(dto);
  }

  async getScoreTablePlayer(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    idPlayer: number
  ): Promise<ScoreTable[][]> {
    const stages = await this.stageService.findByParams({ idGame });
    const characters = await this.characterService.findByParams({
      idGame,
      idMode,
    });
    const scores: ScoreTable[][] = [];
    for (let i = 0, len = characters.length; i < len; i++) {
      const character = characters[i];
      scores.push([]);
      for (const stage of stages) {
        scores[i].push({
          character,
          stage,
          score: await this.getTopScore({
            idGame,
            idMode,
            idType,
            idPlatform,
            idCharacter: character.id,
            idStage: stage.id,
            idPlayer,
          }),
        });
      }
    }
    return scores;
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
    const stages = await this.stageService.findByParams({ idGame });
    const scores: ScoreTable[][] = [];
    for (let i = 0, len = idsPlayer.length; i < len; i++) {
      const idPlayer = idsPlayer[i];
      scores.push([]);
      for (const stage of stages) {
        scores[i].push({
          score: await this.getTopScore({
            idStage: stage.id,
            idGame,
            idMode,
            idPlatform,
            idCharacter,
            idPlayer,
            idType,
          }),
          stage,
        });
      }
    }
    return scores;
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

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }
}
