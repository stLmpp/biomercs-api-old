import { CustomRepository } from '../../../shared/types/custom-repository';
import { UserRole } from './user-role.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserRole)
export class UserRoleRepository extends CustomRepository<UserRole> {}
