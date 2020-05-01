import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SiteUpdateDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
