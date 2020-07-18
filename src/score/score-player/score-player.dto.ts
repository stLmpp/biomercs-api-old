import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ScoreExists } from '../../validation/score/score-exists.validator';
import { CharacterExists } from '../../validation/game/character-exists.validator';
import { PlayerExists } from '../../validation/player/player-exists.validator';

export class ScorePlayerAddDto {
  @IsOptional()
  @IsNumber()
  @ScoreExists()
  idScore?: number;

  @IsDefined()
  @IsNumber()
  @PlayerExists()
  idPlayer: number;

  @IsDefined()
  @IsNumber()
  @CharacterExists()
  idCharacter: number;

  @IsOptional()
  @IsBoolean()
  host?: boolean;

  @IsOptional()
  @IsNumber()
  bulletKills?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class ScorePlayerUpdateDto {
  @IsOptional()
  @IsNumber()
  @CharacterExists()
  idCharacter?: number;

  @IsOptional()
  @IsBoolean()
  host?: boolean;

  @IsOptional()
  @IsNumber()
  bulletKills?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
