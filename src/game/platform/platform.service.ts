import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './platform.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class PlatformService extends SuperService<
  Platform,
  PlatformAddDto,
  PlatformUpdateDto
> {
  constructor(
    @InjectRepository(PlatformRepository)
    private platformRepository: PlatformRepository,
    private fileUploadService: FileUploadService
  ) {
    super(Platform, platformRepository, fileUploadService, {
      idFileKey: 'idLogo',
    });
  }
}
