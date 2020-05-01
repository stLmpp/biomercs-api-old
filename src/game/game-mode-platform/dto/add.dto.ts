import { IsDefined, IsNumber } from 'class-validator';
import { GameModeExists } from '../../../validation/game/game-mode-exists.validator';
import { PlatformExists } from '../../../validation/game/platform-exists.validator';

export class GameModePlatformAddDto {
  @IsDefined()
  @IsNumber()
  @GameModeExists()
  idGameMode: number;

  @IsDefined()
  @IsNumber()
  @PlatformExists()
  idPlatform: number;
}
