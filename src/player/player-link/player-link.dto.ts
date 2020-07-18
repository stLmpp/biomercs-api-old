import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SiteExists } from '../../validation/site/site.validator';
import { PlayerExists } from '../../validation/player/player-exists.validator';

export class PlayerLinkAddDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  url: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsDefined()
  @SiteExists()
  idSite: number;

  @IsNumber()
  @IsDefined()
  @PlayerExists()
  idUser: number;
}

export class PlayerLinkUpdateDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}

export class PlayerLinkParamsDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  idSite?: number;

  @IsNumber()
  @IsOptional()
  idUser?: number;
}
