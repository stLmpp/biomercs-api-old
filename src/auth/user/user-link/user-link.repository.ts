import { UserLink } from './user-link.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserLink)
export class UserLinkRepository extends Repository<UserLink> {}
