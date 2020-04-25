import { IsDefined, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SiteAddDto {
  @IsUrl()
  @IsDefined()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}
