import { IsDefined, IsNumber } from 'class-validator';
import { GameModeExists } from '../../validation/game/game-mode-exists.validator';
import { TypeExists } from '../../validation/game/type-exists.validator';

export class GameModeTypeAddDto {
  @IsDefined()
  @IsNumber()
  @GameModeExists()
  idGameMode: number;

  @IsDefined()
  @IsNumber()
  @TypeExists()
  idType: number;
}
