import { Controller } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { SuperController } from '../shared/super/super-controller';
import { RouteParamEnum } from '../shared/types/route-enums';
import { ReportAddDto, ReportParamsDto } from './report.dto';

@ApiTags('Report')
@Roles(RoleEnum.user)
@Auth()
@Controller('report')
export class ReportController extends SuperController<Report>({
  entity: Report,
  dto: {
    add: ReportAddDto,
    params: ReportParamsDto,
    exists: ReportParamsDto,
  },
  idKey: RouteParamEnum.idReport,
  excludeMethods: ['delete', 'findAll'],
}) {
  constructor(private reportService: ReportService) {
    super(reportService);
  }
}
