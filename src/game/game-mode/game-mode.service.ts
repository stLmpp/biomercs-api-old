import { Injectable } from '@nestjs/common';
import { GameModeRepository } from './game-mode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModeAddDto } from './dto/add.dto';
import { GameMode } from './game-mode.entity';
import { DeleteResult } from '../../util/types';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from '../../auth/user/user.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { FindConditions } from 'typeorm';

@Injectable()
export class GameModeService {
  constructor(
    @InjectRepository(GameModeRepository)
    private gameModeRepository: GameModeRepository,
    private fileUploadService: FileUploadService
  ) {}

  async add(dto: GameModeAddDto): Promise<GameMode> {
    return await this.gameModeRepository.save(new GameMode().extendDto(dto));
  }

  async delete(idGameMode: number): Promise<DeleteResult> {
    return await this.gameModeRepository.delete(idGameMode);
  }

  async exists(idGameMode: number): Promise<boolean> {
    return await this.gameModeRepository.exists({ id: idGameMode });
  }

  async uploadImage(
    idGameMode: number,
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    return await this.fileUploadService.uploadImageToEntity(
      this.gameModeRepository,
      [idGameMode, 'idImage'],
      file,
      user
    );
  }

  async findByParams(idGame: number, idMode: number): Promise<GameMode[]> {
    const where: FindConditions<GameMode> = {};
    if (idGame) {
      where.idGame = idGame;
    }
    if (idMode) {
      where.idMode = idMode;
    }
    return await this.gameModeRepository.find({
      where,
      relations: ['game', 'mode'],
    });
  }
}
