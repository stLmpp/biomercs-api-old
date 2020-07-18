import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RegionExists } from '../validation/region/region-exists.validator';

export class PlayerAddDto {
  @IsString()
  @IsDefined()
  personaName: string;

  @IsOptional()
  @IsNumber()
  idUser?: number;

  @IsOptional()
  @IsNumber()
  idSteamProfile?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsNumber()
  @RegionExists()
  idRegion?: number;
}

export class PlayerUpdateDto {
  @IsString()
  @IsOptional()
  personaName?: string;

  @IsOptional()
  @IsNumber()
  idUser?: number;

  @IsOptional()
  @IsNumber()
  idSteamProfile?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsNumber()
  @RegionExists()
  idRegion?: number;
}
