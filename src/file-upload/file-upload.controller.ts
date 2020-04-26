import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { UseFileUpload } from './file-upload.decorator';
import { FileUpload as FileUploadEntity } from './file-upload.entity';
import { FileType } from './file-type.interface';
import { Response } from 'express';
import { getEnvVar } from '../util/env';
import { RouteParamId, RouteParamTerm } from '../shared/types/route-enums';
import { DeleteResult } from '../util/types';

@ApiTags('File upload')
@Auth()
@Controller('upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post()
  @UseFileUpload()
  @Roles(RoleEnum.admin)
  add(@UploadedFile('file') file: FileType): Promise<FileUploadEntity> {
    return this.fileUploadService.addByFile(file);
  }

  @Get(`name/:${RouteParamTerm.imageName}`)
  @Roles(RoleEnum.user)
  findByName(
    @Param(RouteParamTerm.imageName) imageName: string,
    @Res() response: Response
  ): void {
    response.sendFile(imageName, {
      root: getEnvVar('CONFIG_FILE_UPLOAD_PATH'),
    });
  }

  @Get(`id/:${RouteParamId.idFileUpload}`)
  @Roles(RoleEnum.user)
  async findById(
    @Param(RouteParamId.idFileUpload) idFileUpload: number,
    @Res() response: Response
  ): Promise<void> {
    const file = await this.fileUploadService.findById(idFileUpload);
    if (file) {
      this.findByName(file.filename, response);
    }
  }

  @Delete(`:${RouteParamId.idFileUpload}`)
  @Roles(RoleEnum.admin)
  async delete(
    @Param(RouteParamId.idFileUpload) idFileUpload: number
  ): Promise<DeleteResult> {
    return this.fileUploadService.deleteFile(idFileUpload);
  }
}
