import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SiteExists } from '../../../validation/site/site.validator';
import { UserExists } from '../../../validation/user/user-exists.validator';

export class UserLinkAddDto {
  @IsUrl()
  @IsDefined()
  url: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsDefined()
  @SiteExists()
  idSite: number;

  @IsNumber()
  @IsDefined()
  @UserExists()
  idUser: number;
}

export class UserLinkUpdateDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}

export class UserLinkParamsDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  idSite?: number;

  @IsNumber()
  @IsOptional()
  idUser?: number;
}
