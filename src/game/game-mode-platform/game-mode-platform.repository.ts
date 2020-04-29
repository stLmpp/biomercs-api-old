import { EntityRepository, Repository } from 'typeorm';
import { GameModePlatform } from './game-mode-platform.entity';

@EntityRepository(GameModePlatform)
export class GameModePlatformRepository extends Repository<GameModePlatform> {}
