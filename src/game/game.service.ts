import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { Game } from './game.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { SuperService } from '../shared/super/super-service';
import { GameAddDto, GameParamsDto, GameUpdateDto } from './game.dto';

@Injectable()
export class GameService extends SuperService<Game, GameAddDto, GameUpdateDto> {
  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    private fileUploadService: FileUploadService
  ) {
    super(Game, gameRepository, fileUploadService, { idFileKey: 'idLogo' });
  }

  async findByParams(where: GameParamsDto): Promise<Game[]> {
    return this.gameRepository.findByParams(where);
  }
}
