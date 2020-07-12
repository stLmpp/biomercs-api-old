import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from './user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { UserUpdateDto } from './user.dto';
import { LikeUppercase } from '../../util/query-operators';
import { FindConditions, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) public userRepository: UserRepository,
    private fileUploadService: FileUploadService
  ) {}

  async update(idUser: number, dto: UserUpdateDto): Promise<User> {
    if (dto.email && (await this.existsByEmail(dto.email))) {
      throw new ConflictException('E-mail already registered');
    }
    await this.userRepository.update(idUser, { ...dto });
    return await this.findById(idUser);
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

  async existsByEmail(email: string, idUser?: number): Promise<boolean> {
    const options: FindConditions<User> = { email };
    if (idUser) {
      options.id = Not(idUser);
    }
    return await this.userRepository.exists(options);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.userRepository.exists({ username });
  }

  async findById(idUser: number): Promise<User> {
    return await this.userRepository.findOneOrFail(idUser, {
      relations: ['userLinks', 'userLinks.site', 'region'],
    });
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

  async completeUser(idUser: number): Promise<User> {
    return await this.userRepository.findOne(idUser, {
      relations: [
        'userLinks',
        'userLinks.site',
        'region',
        'userFollowed',
        'userFollowed.followed',
        'userFollowed.follower',
        'userFollowers',
        'userFollowers.follower',
        'userFollowers.followed',
      ],
    });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return await this.userRepository.findByIds(ids);
  }
}
