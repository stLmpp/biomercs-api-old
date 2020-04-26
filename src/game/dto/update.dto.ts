import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GameUpdateDto {
  @IsOptional()
  @IsString()
  game?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;
}
