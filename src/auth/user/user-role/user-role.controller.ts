import { Controller } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { Auth } from '../../auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleAddDto, UserRoleParamsDto } from './user-role.dto';
import { UserRole } from './user-role.entity';
import { RouteParamEnum } from '../../../shared/types/route-enums';
import { RoleEnum } from '../../role/role.enum';
import {
  SuperController,
  SuperControllerRole,
} from '../../../shared/super/super-controller';

@ApiTags('User role')
@Auth()
@Controller('user-role')
export class UserRoleController extends SuperController<UserRole>({
  entity: UserRole,
  dto: {
    add: UserRoleAddDto,
    params: UserRoleParamsDto,
  },
  idKey: RouteParamEnum.idUserRole,
  relations: ['role'],
  excludeMethods: ['findAll'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.owner],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private userRoleService: UserRoleService) {
    super(userRoleService);
  }
}
