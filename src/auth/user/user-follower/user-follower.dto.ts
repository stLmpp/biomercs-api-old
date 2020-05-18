import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { UserExists } from '../../../validation/user/user-exists.validator';
import { SuperParamsDto } from '../../../shared/super/super-params';

export class UserFollowerAddDto {
  @IsDefined()
  @IsNumber()
  @UserExists()
  idUser: number;

  @IsDefined()
  @IsNumber()
  @UserExists()
  idFriend: number;
}

export class UserFollowerExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsNumber()
  idFollower?: number;

  @IsOptional()
  @IsNumber()
  idFollowed?: number;
}
