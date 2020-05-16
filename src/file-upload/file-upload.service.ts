import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { FileUploadAddDto } from './dto/add.dto';
import { FileUpload } from './file-upload.entity';
import { extname } from 'path';
import { FileType } from './file-type.interface';
import { DeleteResult } from '../util/types';
import { unlink } from 'fs';
import { Repository } from 'typeorm';
import { User } from '../auth/user/user.entity';
import { updateLastUpdatedBy } from '../shared/pipes/updated-by.pipe';
import { updateCreatedBy } from '../shared/pipes/created-by.pipe';
import { isArray } from 'is-what';
import { LikeUppercase } from '../util/query-operators';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUploadRepository)
    private fileUploadRepository: FileUploadRepository
  ) {}

  async add(dto: FileUploadAddDto, user: User): Promise<FileUpload> {
    dto = updateCreatedBy(dto, user);
    return await this.fileUploadRepository.save(
      new FileUpload().extendDto({
        ...dto,
        extension: extname(dto.originalFilename).replace('.', ''),
        url: `/upload/name/${dto.filename}`,
      })
    );
  }

  async addByFile(
    { originalname, destination, filename, mimetype, path, size }: FileType,
    user: User
  ): Promise<FileUpload> {
    return await this.add(
      {
        destination,
        originalFilename: originalname,
        filename,
        mimetype,
        path,
        size,
      },
      user
    );
  }

  private async delete(filepath: string): Promise<boolean> {
    return new Promise(resolve => {
      unlink(filepath, () => {
        resolve(true);
      });
    });
  }

  async deleteFile(idFileUpload: number): Promise<DeleteResult>;
  async deleteFile(idsFileUpload: number[]): Promise<DeleteResult>;
  async deleteFile(idOrIds: number | number[]): Promise<DeleteResult> {
    const fileOrFiles = await (isArray(idOrIds)
      ? this.fileUploadRepository.findByIds(idOrIds)
      : this.findById(idOrIds));
    if (isArray(fileOrFiles)) {
      let index = fileOrFiles.length;
      while (index--) {
        const file = fileOrFiles[index];
        await this.delete(file.path);
      }
    } else {
      await this.delete(fileOrFiles.path);
    }
    return await this.fileUploadRepository.delete(idOrIds);
  }

  async findById(idFileUpload: number): Promise<FileUpload> {
    return await this.fileUploadRepository.findOneOrFail(idFileUpload);
  }

  async exists(idFileUpload: number): Promise<boolean> {
    return await this.fileUploadRepository.exists({ id: idFileUpload });
  }

  async uploadImageToEntity<T>(
    repository: Repository<T>,
    [id, key]: [number, keyof T],
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    const entity = await repository.findOneOrFail(id);
    const property = entity[key as string];
    const newFile = await this.addByFile(file, user);
    await repository.update(
      id,
      updateLastUpdatedBy({ [key]: newFile.id }, user) as any
    );
    if (property) {
      await this.deleteFile(property);
    }
    return newFile;
  }

  async findByOriginalFilename(filename: string): Promise<FileUpload> {
    return await this.fileUploadRepository.findOne({
      where: { originalFilename: LikeUppercase(`${filename}.%`) },
    });
  }
}
