import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UpdateResult } from '../../util/types';
import { UserUpdateDto } from './dto/update.dto';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from './user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private fileUploadService: FileUploadService
  ) {}

  async update(idUser: number, dto: UserUpdateDto): Promise<UpdateResult> {
    return await this.userRepository.update(idUser, { ...dto });
  }

  async exists(idUser: number): Promise<boolean> {
    return await this.userRepository.exists({ id: idUser });
  }

  async uploadAvatar(
    idUser: number,
    file: FileType,
    userEditing: User
  ): Promise<FileUpload> {
    return await this.fileUploadService.uploadImageToEntity(
      this.userRepository,
      [idUser, 'idAvatar'],
      file,
      userEditing
    );
  }
}
