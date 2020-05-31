import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { User } from '../user/user.entity';
import { FindConditions, Not } from 'typeorm';
import { RoleEnum } from './role.enum';
import { environment } from '../../shared/env/env';
import { SuperService } from '../../shared/super/super-service';
import { RoleAddDto, RoleUpdateDto } from './role.dto';

@Injectable()
export class RoleService extends SuperService<Role, RoleAddDto, RoleUpdateDto> {
  constructor(
    @InjectRepository(RoleRepository) private roleRepository: RoleRepository
  ) {
    super(Role, roleRepository);
    this.setRoles().then();
  }

  async setRoles(): Promise<void> {
    const exists = await this.roleRepository.exists();
    if (!exists) {
      const roles = (await import('./roles.json')) as RoleAddDto[];
      await this.addMany(roles);
    }
  }

  async get(user: User): Promise<Role[]> {
    const where: FindConditions<Role> = {};
    if (environment.get('USE_ROLE') && !this.isAdmin(user)) {
      where.name = Not(RoleEnum.admin);
    }
    return await this.roleRepository.find({ where });
  }

  async findByName(name: RoleEnum): Promise<Role> {
    return await this.roleRepository.findOneOrFail({ where: { name } });
  }

  isAdmin(user: User): boolean {
    return user?.userRoles?.some(
      userRole => userRole.role.name === RoleEnum.admin
    );
  }
}
