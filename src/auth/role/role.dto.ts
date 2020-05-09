import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleEnum } from './role.enum';

export class RoleAddDto {
  @IsEnum(RoleEnum)
  @IsDefined()
  name: RoleEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class RoleUpdateDto {
  @IsOptional()
  @IsString()
  description?: string;
}

export class RoleExistsDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  name?: RoleEnum;

  @IsOptional()
  @IsString()
  description?: string;
}
