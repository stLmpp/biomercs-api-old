import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { GameExists } from '../validation/game/game-exists.validator';
import { ModeExists } from '../validation/game/mode-exists.validator';
import { PlatformExists } from '../validation/game/platform-exists.validator';
import { StageExists } from '../validation/score/stage-exists-validator';
import { TypeExists } from '../validation/game/type-exists.validator';
import { ScorePlayerAddDto } from './score-player/score-player.dto';
import { ValidTime } from '../validation/score/time.validator';

export class ScoreAddDto {
  @IsDefined()
  @IsNumber()
  @GameExists()
  idGame: number;

  @IsDefined()
  @IsNumber()
  @ModeExists()
  idMode: number;

  @IsDefined()
  @IsNumber()
  @PlatformExists()
  idPlatform: number;

  @IsDefined()
  @IsNumber()
  @StageExists()
  idStage: number;

  @IsDefined()
  @IsNumber()
  @TypeExists()
  idType: number;

  @IsDefined()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  scorePlayers: ScorePlayerAddDto[];

  @IsDefined()
  @IsNumber()
  score: number;

  @IsOptional()
  @IsNumber()
  maxCombo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  @ValidTime()
  time?: string;
}

export class ScoreTopScoreDto {
  @IsDefined()
  @IsNumber()
  idGame: number;

  @IsDefined()
  @IsNumber()
  idMode: number;

  @IsDefined()
  @IsNumber()
  idType: number;

  @IsDefined()
  @IsNumber()
  idPlatform: number;

  @IsOptional()
  @IsNumber()
  idCharacter?: number;

  @IsOptional()
  @IsArray()
  idCharacters?: number[];

  @IsDefined()
  @IsNumber()
  idStage: number;

  @IsOptional()
  @IsNumber()
  idPlayer?: number;
}
