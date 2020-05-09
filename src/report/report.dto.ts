import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { ReferenceTypeInterface } from '../shared/types/reference-type.interface';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { IdReferenceExists } from '../validation/like/id-reference-exists.validator';

export class ReportAddDto implements ReferenceTypeInterface {
  @IsDefined()
  @IsNumber()
  @IdReferenceExists()
  idReference: number;

  @IsDefined()
  @IsEnum(ReferenceTypeEnum)
  type: ReferenceTypeEnum;
}

export class ReportParamsDto implements ReferenceTypeInterface {
  @IsDefined()
  @IsNumber()
  idReference: number;

  @IsDefined()
  @IsEnum(ReferenceTypeEnum)
  type: ReferenceTypeEnum;
}
