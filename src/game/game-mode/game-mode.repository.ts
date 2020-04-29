import { EntityRepository, Repository } from 'typeorm';
import { GameMode } from './game-mode.entity';

@EntityRepository(GameMode)
export class GameModeRepository extends Repository<GameMode> {}
