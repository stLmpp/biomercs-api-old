import { Injectable } from '@nestjs/common';
import { GameModeRepository } from './game-mode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameMode } from './game-mode.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { GameModeAddDto } from './game-mode.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class GameModeService extends SuperService<GameMode, GameModeAddDto> {
  constructor(
    @InjectRepository(GameModeRepository)
    private gameModeRepository: GameModeRepository,
    private fileUploadService: FileUploadService
  ) {
    super(GameMode, gameModeRepository, fileUploadService, {
      idFileKey: 'idImage',
    });
  }
}
