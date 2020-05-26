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
    const characters = await this.characterService.findByParams({
      idGame,
      idMode,
    });
    return Promise.all(
      characters.map(async character => {
        return (
          await this.scoreRepository.getTopScoresStages(
            idPlatform,
            idGame,
            idMode,
            idType,
            idPlayer,
            character.id
          )
        ).map(table => {
          table.character = character;
          return table;
        });
      })
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
    return Promise.all(
      idsPlayer.map(async idPlayer => {
        return await this.scoreRepository.getTopScoresStages(
          idPlatform,
          idGame,
          idMode,
          idType,
          idPlayer,
          idCharacter
        );
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

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }
}
