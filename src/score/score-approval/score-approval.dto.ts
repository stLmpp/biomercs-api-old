import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScoreApprovalStatusEnum } from './score-approval-status.enum';
import { ScoreApprovalRejectionMotiveEnum } from './score-approval-rejection-motive.enum';
import { ScoreApprovalTypeEnum } from './score-approval-type.enum';
import { OmitType } from '@nestjs/swagger';

export class ScoreApprovalAddDto {
  @IsNumber()
  @IsDefined()
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

export class ScoreApprovalAddManyDto extends OmitType<
  ScoreApprovalAddDto,
  'idScore'
>(ScoreApprovalAddDto, ['idScore']) {
  @IsArray()
  @IsNotEmpty()
  @IsDefined()
  idScores: number[];
}
