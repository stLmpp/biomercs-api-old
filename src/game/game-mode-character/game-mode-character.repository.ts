import { EntityRepository, Repository } from 'typeorm';
import { GameModeCharacter } from './game-mode-character.entity';

@EntityRepository(GameModeCharacter)
export class GameModeCharacterRepository extends Repository<
  GameModeCharacter
> {}
