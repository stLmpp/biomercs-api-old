import { IsOptional, IsString } from 'class-validator';

export class TypeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
}
