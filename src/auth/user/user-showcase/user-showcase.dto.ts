import { IsNumber, IsOptional } from 'class-validator';
import { PlatformExists } from '../../../validation/game/platform-exists.validator';
import { GameExists } from '../../../validation/game/game-exists.validator';
import { ModeExists } from '../../../validation/game/mode-exists.validator';
import { TypeExists } from '../../../validation/game/type-exists.validator';

export class UserShowcaseUpdateDto {
  @IsOptional()
  @IsNumber()
  @PlatformExists()
  idPlatform?: number;

  @IsOptional()
  @IsNumber()
  @GameExists()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  @ModeExists()
  idMode?: number;

  @IsOptional()
  @IsNumber()
  @TypeExists()
  idType?: number;
}
