import { PlatformTypeEnum } from '../platform-type.enum';
import { IsDefined, IsEnum, IsString } from 'class-validator';

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
