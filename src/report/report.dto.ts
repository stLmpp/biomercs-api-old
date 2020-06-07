import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ReferenceTypeInterface } from '../shared/types/reference-type.interface';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { IdReferenceExists } from '../validation/like/id-reference-exists.validator';
import { Reason } from './reason/reason.entity';
import { ReportReasonAddDto } from './report-reason/report-reason.dto';

export class ReportAddDto implements ReferenceTypeInterface {
  @IsDefined()
  @IsNumber()
  @IdReferenceExists()
  idReference: number;

  @IsDefined()
  @IsEnum(ReferenceTypeEnum)
  type: ReferenceTypeEnum;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  reasons?: Reason[];

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ValidateNested({ each: true })
  reportReasons?: ReportReasonAddDto[];
}

export class ReportParamsDto implements ReferenceTypeInterface {
  @IsDefined()
  @IsNumber()
  idReference: number;

  @IsDefined()
  @IsEnum(ReferenceTypeEnum)
  type: ReferenceTypeEnum;
}
