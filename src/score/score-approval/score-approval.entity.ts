import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { ScoreApprovalStatusEnum } from './score-approval-status.enum';
import { ScoreApprovalRejectionMotiveEnum } from './score-approval-rejection-motive.enum';
import { Score } from '../score.entity';

@Entity()
export class ScoreApproval extends CommonColumns {
  @Column({ type: 'enum', enum: ScoreApprovalStatusEnum })
  status: ScoreApprovalStatusEnum;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ScoreApprovalRejectionMotiveEnum,
    nullable: true,
  })
  rejectionMotive: ScoreApprovalRejectionMotiveEnum;

  @Column()
  idScore: number;

  @ManyToOne(
    () => Score,
    score => score.scoreApprovals
  )
  @JoinColumn()
  score: Score;
}
