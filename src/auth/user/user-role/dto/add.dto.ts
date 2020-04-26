import { IsDefined, IsNumber } from 'class-validator';
import { UserExists } from '../../../../validation/user/user-exists.validator';
import { RoleExists } from '../../../../validation/role/role-exists.validator';

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
