import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { ReportReason } from './report-reason/report-reason.entity';

@Entity()
export class Report extends CommonColumns {
  @Column({ type: 'enum', enum: ReferenceTypeEnum })
  type: ReferenceTypeEnum;

  @Column()
  idReference: number;

  @Column({ length: 1000, nullable: true })
  description?: string;

  @OneToMany(
    () => ReportReason,
    reportReason => reportReason.report,
    { cascade: true }
  )
  @JoinColumn()
  reportReasons: ReportReason[];
}
