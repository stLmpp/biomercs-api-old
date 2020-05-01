import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameAddDto } from './dto/add.dto';
import { Game } from './game.entity';
import { GameUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../util/types';
import { FileUpload } from '../file-upload/file-upload.entity';
import { FileType } from '../file-upload/file-type.interface';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from '../auth/user/user.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    private fileUploadService: FileUploadService
  ) {}

  async add(dto: GameAddDto): Promise<Game> {
    return await this.gameRepository.save(new Game().extendDto(dto));
  }

  async update(idGame: number, dto: GameUpdateDto): Promise<UpdateResult> {
    return await this.gameRepository.update(idGame, dto);
  }

  async exists(idGame: number): Promise<boolean> {
    return await this.gameRepository.exists({ id: idGame });
  }

  async uploadLogo(
    idGame: number,
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    return await this.fileUploadService.uploadImageToEntity(
      this.gameRepository,
      [idGame, 'idLogo'],
      file,
      user
    );
  }

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find();
  }
}
