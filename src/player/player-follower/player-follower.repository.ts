import { EntityRepository, Repository } from 'typeorm';
import { PlayerFollower } from './player-follower.entity';

@EntityRepository(PlayerFollower)
export class PlayerFollowerRepository extends Repository<PlayerFollower> {}
