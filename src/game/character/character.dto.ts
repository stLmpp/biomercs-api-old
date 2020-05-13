import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SuperParamsDto } from '../../shared/super/super-params';

export class CharacterAddDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  @MaxLength(15)
  shortName: string;
}

export class CharacterUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  shortName?: string;
}

export class CharacterExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortName?: string;
}

export class CharacterParamsDto extends CharacterExistsDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;
}
