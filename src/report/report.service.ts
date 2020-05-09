import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { SuperService } from '../shared/super/super-service';
import { ReportAddDto } from './report.dto';

@Injectable()
export class ReportService extends SuperService<Report, ReportAddDto> {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository
  ) {
    super(Report, reportRepository);
  }
}
