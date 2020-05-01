import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SiteAddDto {
  @IsUrl()
  @IsDefined()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
