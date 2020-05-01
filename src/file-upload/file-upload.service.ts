import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { FileUploadAddDto } from './dto/add.dto';
import { FileUpload } from './file-upload.entity';
import { extname } from 'path';
import { FileType } from './file-type.interface';
import { DeleteResult } from '../util/types';
import { unlink } from 'fs';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../auth/user/user.entity';
import { updateLastUpdatedBy } from '../shared/pipes/updated-by.pipe';
import { updateCreatedBy } from '../shared/pipes/created-by.pipe';

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

  async replaceFile(
    idFileUpload: number,
    { path, originalname, mimetype, filename, destination }: FileType,
    user: User
  ): Promise<UpdateResult> {
    const file = await this.findById(idFileUpload);
    await this.delete(file.path);
    return await this.fileUploadRepository.update(
      idFileUpload,
      updateLastUpdatedBy(
        {
          path,
          url: `/upload/name/${filename}`,
          filename,
          extension: extname(originalname).replace('.', ''),
          destination,
          mimetype,
          originalFilename: originalname,
        },
        user
      )
    );
  }

  private async delete(filepath: string): Promise<boolean> {
    return new Promise(resolve => {
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

  async uploadImageToEntity<T>(
    repository: Repository<T>,
    [id, key]: [number, keyof T],
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    const entity = await repository.findOneOrFail(id);
    const property = entity[key as string];
    if (property) {
      await this.replaceFile(property, file, user);
      return await this.findById(property);
    } else {
      const newFile = await this.addByFile(file, user);
      await repository.update(
        id,
        updateLastUpdatedBy({ [key]: newFile.id }, user) as any
      );
      return newFile;
    }
  }
}
