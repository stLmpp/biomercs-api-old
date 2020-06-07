import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { Reason } from '../reason/reason.entity';
import { Report } from '../report.entity';

@Entity()
export class ReportReason extends CommonColumns {
  @Column()
  idReason: number;

  @ManyToOne(() => Reason)
  @JoinColumn()
  reason: Reason;

  @Column()
  idReport: number;

  @ManyToOne(
    () => Report,
    report => report.reportReasons
  )
  @JoinColumn()
  report: Report;
}
