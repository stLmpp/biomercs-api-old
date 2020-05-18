import { IsNumber, IsOptional } from 'class-validator';
import { UserExists } from '../../../validation/user/user-exists.validator';

export class UserFollowerAddDto {
  @IsOptional()
  @IsNumber()
  @UserExists()
  idUser: number;

  @IsOptional()
  @IsNumber()
  @UserExists()
  idFriend: number;
}
