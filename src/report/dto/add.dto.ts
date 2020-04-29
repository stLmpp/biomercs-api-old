import { ReferenceTypeInterface } from '../../shared/types/reference-type.interface';
import { ReferenceTypeEnum } from '../../shared/types/reference-type.enum';
import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { IdReferenceExists } from '../../validation/like/id-reference-exists.validator';

export class ReportAddDto implements ReferenceTypeInterface {
  @IsDefined()
  @IsNumber()
  @IdReferenceExists()
  idReference: number;

  @IsDefined()
  @IsEnum(ReferenceTypeEnum)
  type: ReferenceTypeEnum;
}
