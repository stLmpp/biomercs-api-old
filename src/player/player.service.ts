import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { FindConditions } from 'typeorm';
import { DeleteResult } from '../util/types';
import { FileType } from '../file-upload/file-type.interface';
import { User } from '../auth/user/user.entity';
import { FileUpload } from '../file-upload/file-upload.entity';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerRepository)
    private playerRepository: PlayerRepository,
    private fileUploadService: FileUploadService
  ) {}

  async add(dto: PlayerAddDto): Promise<Player> {
    return await this.playerRepository.save(new Player().extendDto(dto));
  }

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<Player> {
    return await this.playerRepository.save(
      new Player().extendDto({ ...dto, id: idPlayer })
    );
  }

  async findByUserId(idUser: number): Promise<Player> {
    return await this.playerRepository.findOne({ where: { idUser } });
  }

  async findBySteamProfileId(idSteamProfile: number): Promise<Player> {
    return await this.playerRepository.findOne({ where: { idSteamProfile } });
  }

  async findByIds(idPlayers: number[]): Promise<Player[]> {
    return await this.playerRepository.findByIds(idPlayers);
  }

  async exists(
    where: FindConditions<Player> | FindConditions<Player>[]
  ): Promise<boolean> {
    return await this.playerRepository.exists(where);
  }

  async delete(idPlayer: number): Promise<DeleteResult> {
    return await this.playerRepository.delete(idPlayer);
  }

  async uploadAvatar(
    idPlayer: number,
    file: FileType,
    userEditing: User
  ): Promise<FileUpload> {
    return await this.fileUploadService.uploadImageToEntity(
      this.playerRepository,
      [idPlayer, 'idAvatar'],
      file,
      userEditing
    );
  }
}
