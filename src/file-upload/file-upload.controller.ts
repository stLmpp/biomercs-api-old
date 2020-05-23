import {
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { environment } from '../shared/env/env';
import { RouteParamEnum } from '../shared/types/route-enums';
import { DeleteResult } from '../util/types';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user/user.entity';
import { join } from 'path';
import { fileExists } from '../util/fs';

@ApiTags('File upload')
@Controller('upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Roles(RoleEnum.admin)
  @Auth()
  @UseFileUpload()
  @Post()
  add(
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUploadEntity> {
    return this.fileUploadService.addByFile(file, user);
  }

  @Get(`name/:${RouteParamEnum.imageName}`)
  async findByName(
    @Param(RouteParamEnum.imageName) imageName: string,
    @Res() response: Response
  ): Promise<void> {
    if (
      !(await fileExists(
        join(__dirname, '..', '..', '..', 'uploads', imageName)
      ))
    ) {
      throw new NotFoundException('File not found');
    } else {
      response.sendFile(imageName, {
        root: environment.config('FILE_UPLOAD_PATH'),
      });
    }
  }

  @Get(`id/:${RouteParamEnum.idFileUpload}`)
  async findById(
    @Param(RouteParamEnum.idFileUpload) idFileUpload: number,
    @Res() response: Response
  ): Promise<void> {
    const file = await this.fileUploadService.findById(idFileUpload);
    if (file) {
      await this.findByName(file.filename, response);
    } else {
      throw new NotFoundException('File not found');
    }
  }

  @Roles(RoleEnum.admin)
  @Auth()
  @Delete(`:${RouteParamEnum.idFileUpload}`)
  async delete(
    @Param(RouteParamEnum.idFileUpload) idFileUpload: number
  ): Promise<DeleteResult> {
    return this.fileUploadService.deleteFile(idFileUpload);
  }
}
