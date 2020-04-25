import { CustomRepository } from '../../shared/types/custom-repository';
import { Role } from './role.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(Role)
export class RoleRepository extends CustomRepository<Role> {}
