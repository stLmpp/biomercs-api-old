import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UserLinkUpdateDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
