import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { UserExists } from '../../../validation/user/user-exists.validator';

export class UserFriendAddDto {
  @IsOptional()
  @IsNumber()
  @UserExists()
  idUser: number;

  @IsOptional()
  @IsNumber()
  @UserExists()
  idFriend: number;

  @IsOptional()
  @IsBoolean()
  superFriend?: boolean;
}

export class UserFriendUpdateDto {
  @IsOptional()
  @IsBoolean()
  superFriend?: boolean;
}
