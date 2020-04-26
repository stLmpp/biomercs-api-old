import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { FileUploadAddDto } from './dto/add.dto';
import { FileUpload } from './file-upload.entity';
import { extname } from 'path';
import { FileType } from './file-type.interface';
import { DeleteResult } from '../util/types';
import { unlink } from 'fs';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUploadRepository)
    private fileUploadRepository: FileUploadRepository
  ) {}

  async add(dto: FileUploadAddDto): Promise<FileUpload> {
    return await this.fileUploadRepository.save(
      new FileUpload().extendDto({
        ...dto,
        extension: extname(dto.originalFilename).replace('.', ''),
        url: `/upload/name/${dto.filename}`,
      })
    );
  }

  async addByFile({
    originalname,
    destination,
    filename,
    mimetype,
    path,
    size,
  }: FileType): Promise<FileUpload> {
    return await this.add({
      destination,
      originalFilename: originalname,
      filename,
      mimetype,
      path,
      size,
    });
  }

  private async delete(filepath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      unlink(filepath, () => {
        resolve(true);
      });
    });
  }

  async deleteFile(idFileUpload: number): Promise<DeleteResult> {
    const file = await this.findById(idFileUpload);
    await this.delete(file.path);
    return await this.fileUploadRepository.delete(idFileUpload);
  }

  async findById(idFileUpload: number): Promise<FileUpload> {
    return await this.fileUploadRepository.findOneOrFail(idFileUpload);
  }

  async exists(idFileUpload: number): Promise<boolean> {
    return await this.fileUploadRepository.exists({ id: idFileUpload });
  }
}
