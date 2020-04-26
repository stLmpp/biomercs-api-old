import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { LikeTypeEnum } from '../like-type.enum';
import { LikeStyleEnum } from '../like-style.enum';
import { UserExists } from '../../validation/user/user-exists.validator';
import { LikeTypeInterface } from '../like-type.interface';
import { IdReferenceExists } from '../../validation/like/id-reference-exists.validator';

export class LikeAddDto implements LikeTypeInterface {
  @IsDefined()
  @IsNumber()
  @UserExists()
  idUser: number;

  @IsEnum(LikeTypeEnum)
  @IsDefined()
  type: LikeTypeEnum;

  @IsDefined()
  @IsEnum(LikeStyleEnum)
  style: LikeStyleEnum;

  @IsNumber()
  @IsDefined()
  @IdReferenceExists()
  idReference: number;
}
