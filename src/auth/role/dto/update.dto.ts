import { IsOptional, IsString } from 'class-validator';

export class RoleUpdateDto {
  @IsOptional()
  @IsString()
  description?: string;
}
