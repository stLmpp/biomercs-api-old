import { EntityRepository } from 'typeorm';
import { GameModeCharacter } from './game-mode-character.entity';
import { CustomRepository } from '../../shared/types/custom-repository';

@EntityRepository(GameModeCharacter)
export class GameModeCharacterRepository extends CustomRepository<
  GameModeCharacter
> {}
