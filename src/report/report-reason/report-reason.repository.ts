import { EntityRepository, Repository } from 'typeorm';
import { ReportReason } from './report-reason.entity';

@EntityRepository(ReportReason)
export class ReportReasonRepository extends Repository<ReportReason> {}
