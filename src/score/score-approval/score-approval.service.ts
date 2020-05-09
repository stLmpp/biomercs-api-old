import { Injectable } from '@nestjs/common';
import { ScoreApprovalRepository } from './score-approval.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreApproval } from './score-approval.entity';
import { SuperService } from '../../shared/super/super-service';
import { ScoreApprovalAddDto } from './score-approval.dto';

@Injectable()
export class ScoreApprovalService extends SuperService<
  ScoreApproval,
  ScoreApprovalAddDto
> {
  constructor(
    @InjectRepository(ScoreApprovalRepository)
    private scoreApprovalRepository: ScoreApprovalRepository
  ) {
    super(ScoreApproval, scoreApprovalRepository);
  }
}
