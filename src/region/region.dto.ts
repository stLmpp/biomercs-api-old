import { IsDefined, IsOptional, IsString } from 'class-validator';
import { SuperParamsDto } from '../shared/super/super-params';

export class RegionAddDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  shortName: string;
}

export class RegionUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortName?: string;
}

export class RegionExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortName?: string;
}
