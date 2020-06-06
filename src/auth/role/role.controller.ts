import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth.decorator';
import { RoleEnum } from './role.enum';
import { Role } from './role.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { GetUser } from '../get-user.decorator';
import { User } from '../user/user.entity';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';
import { RoleAddDto, RoleExistsDto, RoleUpdateDto } from './role.dto';

@ApiTags('Role')
@Auth()
@Controller('role')
export class RoleController extends SuperController<Role>({
  entity: Role,
  dto: {
    add: RoleAddDto,
    update: RoleUpdateDto,
    exists: RoleExistsDto,
  },
  idKey: RouteParamEnum.idRole,
  searchBy: ['name', 'description'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.owner],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private roleService: RoleService) {
    super(roleService);
  }

  @Get()
  get(@GetUser() user: User): Promise<Role[]> {
    return this.roleService.get(user);
  }
}
