import { Injectable } from '@nestjs/common';
import { GameModePlatformRepository } from './game-mode-platform.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModePlatform } from './game-mode-platform.entity';
import { GameModePlatformAddDto } from './game-mode-platform.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class GameModePlatformService extends SuperService<
  GameModePlatform,
  GameModePlatformAddDto
> {
  constructor(
    @InjectRepository(GameModePlatformRepository)
    private gameModePlatformRepository: GameModePlatformRepository
  ) {
    super(GameModePlatform, gameModePlatformRepository);
  }
}
