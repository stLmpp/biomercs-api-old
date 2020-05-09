import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleRepository } from './user-role.repository';
import { UserRole } from './user-role.entity';
import { UserRoleAddDto } from './user-role.dto';
import { SuperService } from '../../../shared/super/super-service';

@Injectable()
export class UserRoleService extends SuperService<UserRole, UserRoleAddDto> {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository
  ) {
    super(UserRole, userRoleRepository);
  }
}
