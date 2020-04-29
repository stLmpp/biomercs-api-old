import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportAddDto } from './dto/add.dto';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { FindConditions } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository
  ) {}

  async add(dto: ReportAddDto): Promise<Report> {
    return await this.reportRepository.save(new Report().extendDto(dto));
  }

  async find(
    idReference?: number,
    type?: ReferenceTypeEnum
  ): Promise<Report[]> {
    if (!idReference && !type) {
      throw new BadRequestException('Needs at least one parameter');
    }
    const where: FindConditions<Report> = {};
    if (idReference) {
      where.idReference = idReference;
    }
    if (type) {
      where.type = type;
    }
    return await this.reportRepository.find({ where });
  }
}
