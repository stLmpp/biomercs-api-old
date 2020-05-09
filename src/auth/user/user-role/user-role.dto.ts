import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { UserExists } from '../../../validation/user/user-exists.validator';
import { RoleExists } from '../../../validation/role/role-exists.validator';

export class UserRoleAddDto {
  @IsNumber()
  @IsDefined()
  @UserExists()
  idUser: number;

  @IsNumber()
  @IsDefined()
  @RoleExists()
  idRole: number;
}

export class UserRoleParamsDto {
  @IsNumber()
  @IsOptional()
  idUser?: number;

  @IsNumber()
  @IsOptional()
  idRole?: number;
}
