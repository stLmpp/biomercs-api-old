import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UpdateResult } from '../../util/types';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from './user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { UserUpdateDto } from './user.dto';
import { LikeUppercase } from '../../util/query-operators';
import { FindConditions } from 'typeorm';

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

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.exists({ email });
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.userRepository.exists({ username });
  }

  async findById(idUser: number): Promise<User> {
    return (
      await this.userRepository.findOneOrFail(idUser, {
        relations: ['userLinks', 'userLinks.site'],
      })
    )?.removePasswordAndSalt();
  }

  async search(username: string, email: string): Promise<User[]> {
    const where: FindConditions<User>[] = [];
    if (username) {
      where.push({ username: LikeUppercase(`%${username}%`) });
    }
    if (email) {
      where.push({ email: LikeUppercase(`%${email}%`) });
    }
    return await this.userRepository.find({
      where,
      take: 30,
    });
  }

  async ban(idUser: number): Promise<void> {
    await this.userRepository.softDelete(idUser);
  }
}
