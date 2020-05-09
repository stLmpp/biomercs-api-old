import { IsDefined, IsNumber } from 'class-validator';
import { GameExists } from '../../validation/game/game-exists.validator';
import { ModeExists } from '../../validation/game/mode-exists.validator';

export class GameModeAddDto {
  @IsNumber()
  @IsDefined()
  @GameExists()
  idGame: number;

  @IsNumber()
  @IsDefined()
  @ModeExists()
  idMode: number;
}
