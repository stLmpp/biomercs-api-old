import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleRepository } from './user-role.repository';
import { UserRole } from './user-role.entity';
import { UserService } from '../user.service';
import { RoleService } from '../../role/role.service';
import { DeleteResult } from '../../../util/types';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  async add(idUser: number, idRole: number): Promise<UserRole> {
    if (!(await this.userService.exists(idUser))) {
      throw new BadRequestException(`User doesn't exist`);
    }
    if (!(await this.roleService.exists(idRole))) {
      throw new BadRequestException(`Role doesn't exist`);
    }
    return await this.userRoleRepository.save(
      new UserRole().extendDto({ idRole, idUser })
    );
  }

  async delete(idUserRole: number): Promise<DeleteResult> {
    return await this.userRoleRepository.delete(idUserRole);
  }
}
