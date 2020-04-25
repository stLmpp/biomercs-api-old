import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

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
  idSite: number;
}
