import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { LikeStyleEnum } from '../like-style.enum';
import { IdReferenceExists } from '../../validation/like/id-reference-exists.validator';
import { ReferenceTypeInterface } from '../../shared/types/reference-type.interface';
import { ReferenceTypeEnum } from '../../shared/types/reference-type.enum';

export class LikeAddDto implements ReferenceTypeInterface {
  @IsEnum(ReferenceTypeEnum)
  @IsDefined()
  type: ReferenceTypeEnum;

  @IsDefined()
  @IsEnum(LikeStyleEnum)
  style: LikeStyleEnum;

  @IsNumber()
  @IsDefined()
  @IdReferenceExists()
  idReference: number;
}
