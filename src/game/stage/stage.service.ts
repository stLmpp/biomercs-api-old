import { Injectable } from '@nestjs/common';
import { StageRepository } from './stage.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Stage } from './stage.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { StageAddDto, StageUpdateDto } from './stage.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class StageService extends SuperService<
  Stage,
  StageAddDto,
  StageUpdateDto
> {
  constructor(
    @InjectRepository(StageRepository) private stageRepository: StageRepository,
    private fileUploadService: FileUploadService
  ) {
    super(Stage, stageRepository, fileUploadService, { idFileKey: 'idImage' });
  }
}
