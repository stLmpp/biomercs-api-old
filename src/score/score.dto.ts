import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
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
import { OmitType } from '@nestjs/swagger';
import { IsLessThan } from '../validation/is-less-than';
import { IsGreaterThan } from '../validation/is-greater-than';
import { ScoreStatusEnum } from './score-status/score-status.enum';

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

  @IsOptional()
  @IsBoolean()
  idCharactersAnd?: boolean;

  @IsDefined()
  @IsNumber()
  idStage: number;

  @IsOptional()
  @IsNumber()
  idPlayer?: number;
}

export class ScoreAverageDto extends ScoreTopScoreDto {
  @IsDefined()
  @IsNumber()
  maxCombo: number;

  @IsDefined()
  @IsString()
  @ValidTime()
  time: string;

  @IsDefined()
  @IsNumber()
  score: number;
}

export class ScoreIsWrDto extends OmitType(ScoreTopScoreDto, [
  'idCharactersAnd',
  'idCharacter',
  'idPlayer',
]) {
  @IsDefined()
  @IsNumber()
  score: number;
}

export class ScoreRandomDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;

  @IsOptional()
  @IsNumber()
  idType?: number;

  @IsOptional()
  @IsNumber()
  idPlatform?: number;

  @IsOptional()
  @IsNumber()
  idCharacter?: number;

  @IsOptional()
  @IsNumber()
  idStage?: number;

  @IsOptional()
  @IsNumber()
  idPlayer?: number;
}

export class ScoreApprovalParamsDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;

  @IsOptional()
  @IsNumber()
  idType?: number;

  @IsOptional()
  @IsNumber()
  idPlatform?: number;

  @IsOptional()
  @IsNumber()
  idCharacter?: number;

  @IsOptional()
  @IsNumber()
  idStage?: number;

  @IsOptional()
  @IsNumber()
  idPlayer?: number;

  @IsEnum(ScoreStatusEnum)
  @IsDefined()
  idScoreStatus: ScoreStatusEnum;

  @IsOptional()
  @IsDate()
  @IsLessThan('endDate')
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @IsGreaterThan('startDate')
  endDate?: Date;
}
