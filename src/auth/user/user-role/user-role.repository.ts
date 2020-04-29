import { UserRole } from './user-role.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {}
