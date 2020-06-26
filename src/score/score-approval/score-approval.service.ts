import { Injectable } from '@nestjs/common';
import { ScoreApprovalRepository } from './score-approval.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreApproval } from './score-approval.entity';
import { SuperService } from '../../shared/super/super-service';
import {
  ScoreApprovalAddDto,
  ScoreApprovalAddManyDto,
} from './score-approval.dto';
import { ScoreRepository } from '../score.repository';
import { ScoreApprovalTypeEnum } from './score-approval-type.enum';
import { ScoreStatusEnum } from '../score-status/score-status.enum';
import { ScoreApprovalStatusEnum } from './score-approval-status.enum';

@Injectable()
export class ScoreApprovalService extends SuperService<
  ScoreApproval,
  ScoreApprovalAddDto
> {
  constructor(
    @InjectRepository(ScoreApprovalRepository)
    private scoreApprovalRepository: ScoreApprovalRepository,
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository
  ) {
    super(ScoreApproval, scoreApprovalRepository);
  }

  private getIdScoreStatus(
    dto: Omit<
      ScoreApprovalAddDto,
      'idScore' | 'description' | 'rejectionMotive'
    >
  ): ScoreStatusEnum {
    let idScoreStatus: ScoreStatusEnum;
    if (dto.type === ScoreApprovalTypeEnum.admin) {
      idScoreStatus =
        dto.status === ScoreApprovalStatusEnum.approved
          ? ScoreStatusEnum.approved
          : ScoreStatusEnum.rejectedAdmin;
    } else if (dto.type === ScoreApprovalTypeEnum.user) {
      idScoreStatus =
        dto.status === ScoreApprovalStatusEnum.approved
          ? ScoreStatusEnum.pendingAdmin
          : ScoreStatusEnum.rejectedUser;
    }
    return idScoreStatus;
  }

  async add(
    dto: ScoreApprovalAddDto,
    relations: (keyof ScoreApproval)[] | string[] = []
  ): Promise<ScoreApproval> {
    const newDto = new ScoreApproval().extendDto({ ...dto, active: true });
    const scoreApproval = await super.add(newDto, relations);
    await this.scoreRepository.update(dto.idScore, {
      idScoreStatus: this.getIdScoreStatus({
        type: dto.type,
        status: dto.status,
      }),
    });
    return scoreApproval;
  }

  async many({
    idScores,
    ...dto
  }: ScoreApprovalAddManyDto): Promise<ScoreApproval[]> {
    const idScoreStatus = this.getIdScoreStatus({
      status: dto.status,
      type: dto.type,
    });
    const scoreApprovals = idScores.map(idScore =>
      new ScoreApproval().extendDto({ ...dto, idScore, active: true })
    );
    const scoreApprovalsSaved = await this.addMany(scoreApprovals);
    await this.scoreRepository.update(idScores, { idScoreStatus });
    return scoreApprovalsSaved;
  }
}
