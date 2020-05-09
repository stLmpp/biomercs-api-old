import { IsBoolean, IsDefined, IsNumber, IsOptional } from 'class-validator';
import { ScoreExists } from '../../validation/score/score-exists.validator';
import { UserExists } from '../../validation/user/user-exists.validator';
import { CharacterExists } from '../../validation/game/character-exists.validator';

export class ScorePlayerAddDto {
  @IsDefined()
  @IsNumber()
  @ScoreExists()
  idScore: number;

  @IsDefined()
  @IsNumber()
  @UserExists()
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
}
