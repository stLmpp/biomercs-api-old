import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { SuperService } from '../shared/super/super-service';
import { ReportAddDto } from './report.dto';
import { plainToClass } from 'class-transformer';
import { ReportReasonAddDto } from './report-reason/report-reason.dto';

@Injectable()
export class ReportService extends SuperService<Report, ReportAddDto> {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository
  ) {
    super(Report, reportRepository);
  }

  preAdd({ reasons, reportReasons, ...dto }: ReportAddDto): ReportAddDto {
    const newReasons =
      reportReasons ??
      reasons.map(reason =>
        plainToClass(ReportReasonAddDto, { idReason: reason.id })
      );
    return plainToClass(ReportAddDto, { ...dto, reportReasons: newReasons });
  }
}
