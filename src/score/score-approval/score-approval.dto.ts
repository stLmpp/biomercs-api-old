import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScoreExists } from '../../validation/score/score-exists.validator';
import { ScoreApprovalStatusEnum } from './score-approval-status.enum';
import { ScoreApprovalRejectionMotiveEnum } from './score-approval-rejection-motive.enum';
import { ScoreApprovalTypeEnum } from './score-approval-type.enum';

export class ScoreApprovalAddDto {
  @IsNumber()
  @IsDefined()
  @ScoreExists()
  idScore: number;

  @IsDefined()
  @IsEnum(ScoreApprovalStatusEnum)
  status: ScoreApprovalStatusEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ScoreApprovalRejectionMotiveEnum)
  rejectionMotive?: ScoreApprovalRejectionMotiveEnum;

  @IsOptional()
  @IsEnum(ScoreApprovalTypeEnum)
  type?: ScoreApprovalTypeEnum;
}
