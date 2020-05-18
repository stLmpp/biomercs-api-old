import { EntityRepository, Repository } from 'typeorm';
import { UserFollower } from './user-follower.entity';

@EntityRepository(UserFollower)
export class UserFollowerRepository extends Repository<UserFollower> {}
