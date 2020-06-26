import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { ScorePlayerExists } from '../../validation/score/score-player-exists.validator';
import { SiteExists } from '../../validation/site/site.validator';

export class ScorePlayerProofAddDto {
  @IsDefined()
  @IsString()
  url: string;

  @IsDefined()
  @IsNumber()
  @ScorePlayerExists()
  idScorePlayer: number;

  @IsDefined()
  @IsNumber()
  @SiteExists()
  idSite: number;
}

export class ScorePlayerProofUpdateDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  @SiteExists()
  idSite?: number;
}
