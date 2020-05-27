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
  ) {
    /*this.fake().then();*/
  }

  async fake(): Promise<void> {
    /*const sample = <T>(array: T[]): T =>
      array[Math.floor(Math.random() * array.length)];

    function randomInteger(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const users = await this.userService.search('', '');
    const stages = await this.stageService.findAll();
    const characters = await this.characterService.findAll([
      'gameModeCharacters',
    ]);
    const gameModePlatforms = await this.gameModePlatformService.findAll([
      'gameMode',
    ]);
    const types = await this.typeService.findAll();
    const getTime = (): string => ('' + randomInteger(0, 99)).padStart(2, '0');
    const scores = Array.from({ length: 5000 }).map(() => {
      const gameModePlatform = sample(gameModePlatforms);
      const type = sample(types);
      const scorePlayers = Array.from({ length: type.playerQuantity }).map(() =>
        new ScorePlayer().extendDto({
          idCharacter: sample(
            characters.filter(char =>
              char.gameModeCharacters.some(
                o => o.idGameMode === gameModePlatform.idGameMode
              )
            )
          ).id,
          bulletKills: randomInteger(0, 30),
          host: true,
          idPlayer: sample(users).id,
        })
      );
      return new Score().extendDto({
        scorePlayers,
        score: randomInteger(750_000, 1_800_000),
        idGameModePlatform: gameModePlatform.id,
        idStage: sample(
          stages.filter(
            stage => stage.idGame === gameModePlatform.gameMode.idGame
          )
        ).id,
        idType: type.id,
        maxCombo: randomInteger(50, 150),
        time: `${getTime()}:${getTime()}:${getTime()}`,
      });
    });
    await this.scoreRepository.save(scores);*/
  }

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

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }
}
