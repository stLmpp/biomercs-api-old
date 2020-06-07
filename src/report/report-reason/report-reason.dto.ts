import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { ReasonExists } from '../../validation/report/reason-exists.validator';

export class ReportReasonAddDto {
  @IsOptional()
  @IsNumber()
  idReport?: number;

  @IsDefined()
  @IsNumber()
  @ReasonExists()
  idReason: number;
}
