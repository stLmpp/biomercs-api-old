import { EntityRepository, Repository } from 'typeorm';
import { PlayerShowcase } from './player-showcase.entity';

@EntityRepository(PlayerShowcase)
export class PlayerShowcaseRepository extends Repository<PlayerShowcase> {}
