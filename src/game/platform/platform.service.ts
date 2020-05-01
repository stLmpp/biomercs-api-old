import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformAddDto } from './dto/add.dto';
import { PlatformUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { Platform } from './platform.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from '../../auth/user/user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformRepository)
    private platformRepository: PlatformRepository,
    private fileUploadService: FileUploadService
  ) {}

  async add(dto: PlatformAddDto): Promise<Platform> {
    return await this.platformRepository.save(new Platform().extendDto(dto));
  }

  async update(
    idPlatform: number,
    dto: PlatformUpdateDto
  ): Promise<UpdateResult> {
    return await this.platformRepository.update(idPlatform, dto);
  }

  async exists(idPlatform: number): Promise<boolean> {
    return await this.platformRepository.exists({ id: idPlatform });
  }

  async uploadLogo(
    idPlatform: number,
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    return await this.fileUploadService.uploadImageToEntity(
      this.platformRepository,
      [idPlatform, 'idLogo'],
      file,
      user
    );
  }
}
