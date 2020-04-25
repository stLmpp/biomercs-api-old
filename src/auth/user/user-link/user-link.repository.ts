import { CustomRepository } from '../../../shared/types/custom-repository';
import { UserLink } from './user-link.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserLink)
export class UserLinkRepository extends CustomRepository<UserLink> {}
