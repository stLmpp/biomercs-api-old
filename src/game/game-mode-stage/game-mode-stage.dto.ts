import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { GameModeExists } from '../../validation/game/game-mode-exists.validator';
import { StageExists } from '../../validation/score/stage-exists-validator';

export class GameModeStageAddDto {
  @IsDefined()
  @IsNumber()
  @GameModeExists()
  idGameMode: number;

  @IsDefined()
  @IsNumber()
  @StageExists()
  idStage: number;
}

export class GameModeStageUpdateDto {
  @IsOptional()
  @IsNumber()
  maxEnemies?: number;

  @IsOptional()
  @IsNumber()
  maxCombo?: number;
}

export class GameModeStageParamsDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;

  @IsOptional()
  @IsNumber()
  idStage?: number;
}
