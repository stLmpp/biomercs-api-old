import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { ReportAddDto } from './dto/add.dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { RouteParamId, RouteParamTerm } from '../shared/types/route-enums';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';

@ApiTags('Report')
@Roles(RoleEnum.user)
@Auth()
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: ReportAddDto): Promise<Report> {
    return this.reportService.add(dto);
  }

  @Get()
  find(
    @Query(RouteParamId.idReference) idReference?: number,
    @Query(RouteParamTerm.type) type?: ReferenceTypeEnum
  ): Promise<Report[]> {
    return this.reportService.find(idReference, type);
  }
}
