import { EntityRepository, Repository } from 'typeorm';
import { UserShowcase } from './user-showcase.entity';

@EntityRepository(UserShowcase)
export class UserShowcaseRepository extends Repository<UserShowcase> {}
