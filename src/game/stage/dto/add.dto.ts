import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { GameExists } from '../../../validation/game/game-exists.validator';

export class StageAddDto {
  @IsDefined()
  @IsNumber()
  @GameExists()
  idGame: number;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  @MaxLength(10)
  shortName: string;

  @IsOptional()
  @IsBoolean()
  custom?: boolean;

  @IsOptional()
  @IsUrl()
  customUrl?: string;
}
