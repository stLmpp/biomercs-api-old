import { Injectable } from '@nestjs/common';
import { GameModeStageRepository } from './game-mode-stage.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperService } from '../../shared/super/super-service';
import { GameModeStage } from './game-mode-stage.entity';
import {
  GameModeStageAddDto,
  GameModeStageUpdateDto,
} from './game-mode-stage.dto';

@Injectable()
export class GameModeStageService extends SuperService<
  GameModeStage,
  GameModeStageAddDto,
  GameModeStageUpdateDto
> {
  constructor(
    @InjectRepository(GameModeStageRepository)
    private gameModeStageRepository: GameModeStageRepository
  ) {
    super(GameModeStage, gameModeStageRepository);
  }

  async findIdByIds(
    idGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return await this.gameModeStageRepository.findIdByIds(
      idGame,
      idMode,
      idStage
    );
  }
}
