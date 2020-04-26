import { EntityRepository } from 'typeorm';
import { GameMode } from './game-mode.entity';
import { CustomRepository } from '../../shared/types/custom-repository';

@EntityRepository(GameMode)
export class GameModeRepository extends CustomRepository<GameMode> {}
