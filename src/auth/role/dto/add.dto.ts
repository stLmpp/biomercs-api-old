import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleEnum } from '../role.enum';

export class RoleAddDto {
  @IsEnum(RoleEnum)
  @IsDefined()
  name: RoleEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
