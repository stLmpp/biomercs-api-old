import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleAddDto } from './dto/add.dto';
import { RoleUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { User } from '../user/user.entity';
import { FindConditions, Not } from 'typeorm';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository) private roleRepository: RoleRepository
  ) {}

  async add(dto: RoleAddDto): Promise<Role> {
    return await this.roleRepository.save(new Role().extendDto(dto));
  }

  async update(idRole: number, dto: RoleUpdateDto): Promise<UpdateResult> {
    return await this.roleRepository.update(idRole, dto);
  }

  async exists(idRole: number): Promise<boolean> {
    return await this.roleRepository.exists({ id: idRole });
  }

  async get(user: User): Promise<Role[]> {
    const where: FindConditions<Role> = {};
    if (
      user.userRoles.some(userRole => userRole.role.name !== RoleEnum.admin)
    ) {
      where.name = Not(RoleEnum.admin);
    }
    return await this.roleRepository.find({ where });
  }
}
