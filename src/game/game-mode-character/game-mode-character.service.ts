import { Injectable } from '@nestjs/common';
import { GameModeCharacterRepository } from './game-mode-character.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModeCharacter } from './game-mode-character.entity';
import { GameModeCharacterAddDto } from './game-mode-character.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class GameModeCharacterService extends SuperService<
  GameModeCharacter,
  GameModeCharacterAddDto
> {
  constructor(
    @InjectRepository(GameModeCharacterRepository)
    private gameModeCharacterRepository: GameModeCharacterRepository
  ) {
    super(GameModeCharacter, gameModeCharacterRepository);
  }
}
