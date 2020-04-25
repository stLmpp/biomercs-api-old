import { IsDefined, IsNumber } from 'class-validator';

export class UserRoleAddDto {
  @IsNumber()
  @IsDefined()
  idUser: number;

  @IsNumber()
  @IsDefined()
  idRole: number;
}
