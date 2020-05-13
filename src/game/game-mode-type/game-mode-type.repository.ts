import { EntityRepository, Repository } from 'typeorm';
import { GameModeType } from './game-mode-type.entity';

@EntityRepository(GameModeType)
export class GameModeTypeRepository extends Repository<GameModeType> {}
