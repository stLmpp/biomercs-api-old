import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { PlatformTypeEnum } from './platform-type.enum';

export class PlatformAddDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  shortName: string;

  @IsDefined()
  @IsEnum(PlatformTypeEnum)
  type: PlatformTypeEnum;
}

export class PlatformUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortName?: string;

  @IsOptional()
  @IsEnum(PlatformTypeEnum)
  type?: PlatformTypeEnum;
}
