import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class StageUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;

  @IsOptional()
  @IsBoolean()
  custom?: boolean;

  @IsOptional()
  @IsUrl()
  customUrl?: string;
}
