import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlatformTypeEnum } from '../platform-type.enum';

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
