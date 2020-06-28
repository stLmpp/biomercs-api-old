import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class StageAddDto {
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

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class StageUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;

  @IsOptional()
  @IsBoolean()
  custom?: boolean;

  @IsOptional()
  @IsUrl()
  customUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class StageParamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;

  @IsOptional()
  @IsBoolean()
  custom?: boolean;

  @IsOptional()
  @IsUrl()
  customUrl?: string;

  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;
}
