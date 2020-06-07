import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportReasonController } from './report-reason/report-reason.controller';
import { ReportReasonService } from './report-reason/report-reason.service';
import { ReasonController } from './reason/reason.controller';
import { ReasonService } from './reason/reason.service';
import { ReasonRepository } from './reason/reason.repository';
import { ReportReasonRepository } from './report-reason/report-reason.repository';
import { ReportRepository } from './report.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportRepository,
      ReasonRepository,
      ReportReasonRepository,
    ]),
  ],
  controllers: [ReportController, ReportReasonController, ReasonController],
  providers: [ReportService, ReportReasonService, ReasonService],
  exports: [ReasonService],
})
export class ReportModule {}
