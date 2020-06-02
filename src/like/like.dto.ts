import { IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IdReferenceExists } from '../validation/like/id-reference-exists.validator';
import { LikeStyleEnum } from './like-style.enum';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { ReferenceTypeInterface } from '../shared/types/reference-type.interface';
import { SuperParamsDto } from '../shared/super/super-params';

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

export class LikeUpdateDto {
  @IsOptional()
  @IsEnum(LikeStyleEnum)
  style?: LikeStyleEnum;
}

export class LikeParamsDto extends SuperParamsDto {
  @IsEnum(ReferenceTypeEnum)
  @IsOptional()
  type?: ReferenceTypeEnum;

  @IsOptional()
  @IsEnum(LikeStyleEnum)
  style?: LikeStyleEnum;

  @IsOptional()
  @IsNumber()
  idReference?: number;
}

export class LikeDeteteDto {
  @IsEnum(ReferenceTypeEnum)
  @IsDefined()
  type?: ReferenceTypeEnum;

  @IsOptional()
  @IsEnum(LikeStyleEnum)
  style?: LikeStyleEnum;

  @IsDefined()
  @IsNumber()
  idReference?: number;
}
