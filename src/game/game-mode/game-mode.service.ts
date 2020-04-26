import { Injectable } from '@nestjs/common';
import { GameModeRepository } from './game-mode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModeAddDto } from './dto/add.dto';
import { GameMode } from './game-mode.entity';
import { DeleteResult } from '../../util/types';

@Injectable()
export class GameModeService {
  constructor(
    @InjectRepository(GameModeRepository)
    private gameModeRepository: GameModeRepository
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
}
