import { PlayerLink } from './player-link.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PlayerLink)
export class PlayerLinkRepository extends Repository<PlayerLink> {}
