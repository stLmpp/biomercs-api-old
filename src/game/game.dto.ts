import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SuperParamsDto } from '../shared/super/super-params';

export class GameAddDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  @MaxLength(10)
  shortName: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class GameUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;
}

export class GameExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortName?: string;
}

export class GameParamsDto extends GameExistsDto {
  @IsOptional()
  @IsNumber()
  idPlatform?: number;
}
