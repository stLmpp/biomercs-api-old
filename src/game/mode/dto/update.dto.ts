import { IsOptional, IsString } from 'class-validator';

export class ModeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
}
