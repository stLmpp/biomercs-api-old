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
  @IsDefined()
  @IsNotEmpty()
  replace: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class SiteUpdateDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  replace?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
