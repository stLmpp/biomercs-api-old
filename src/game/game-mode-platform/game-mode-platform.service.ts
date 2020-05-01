import { Injectable } from '@nestjs/common';
import { GameModePlatformRepository } from './game-mode-platform.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModePlatform } from './game-mode-platform.entity';
import { GameModePlatformAddDto } from './dto/add.dto';
import { DeleteResult } from '../../util/types';

@Injectable()
export class GameModePlatformService {
  constructor(
    @InjectRepository(GameModePlatformRepository)
    private gameModePlatformRepository: GameModePlatformRepository
  ) {}

  async add(dto: GameModePlatformAddDto): Promise<GameModePlatform> {
    return await this.gameModePlatformRepository.save(
      new GameModePlatform().extendDto(dto)
    );
  }

  async delete(idGameModePlatform: number): Promise<DeleteResult> {
    return await this.gameModePlatformRepository.delete(idGameModePlatform);
  }
}
