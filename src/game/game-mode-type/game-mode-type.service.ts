import { Injectable } from '@nestjs/common';
import { SuperService } from '../../shared/super/super-service';
import { GameModeType } from './game-mode-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModeTypeRepository } from './game-mode-type.repository';
import { GameModeTypeAddDto } from './game-mode-type.dto';

@Injectable()
export class GameModeTypeService extends SuperService<
  GameModeType,
  GameModeTypeAddDto
> {
  constructor(
    @InjectRepository(GameModeTypeRepository)
    private gameModeTypeRepository: GameModeTypeRepository
  ) {
    super(GameModeType, gameModeTypeRepository);
  }
}
