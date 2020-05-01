import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { ScorePlayerExists } from '../../../validation/score/score-player-exists.validator';

export class ScorePlayerProofAddDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsDefined()
  @IsNumber()
  @ScorePlayerExists()
  idScorePlayer: number;
}
