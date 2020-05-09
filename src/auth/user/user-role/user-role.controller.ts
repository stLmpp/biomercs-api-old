import { Controller } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { Auth } from '../../auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleAddDto, UserRoleParamsDto } from './user-role.dto';
import { UserRole } from './user-role.entity';
import { RouteParamId } from '../../../shared/types/route-enums';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';
import { SuperController } from '../../../shared/super/super-controller';

@ApiTags('User role')
@Roles(RoleEnum.admin)
@Auth()
@Controller('user-role')
export class UserRoleController extends SuperController<UserRole>({
  entity: UserRole,
  dto: {
    add: UserRoleAddDto,
    params: UserRoleParamsDto,
  },
  idKey: RouteParamId.idUserRole,
  excludeMethods: ['findAll'],
}) {
  constructor(private userRoleService: UserRoleService) {
    super(userRoleService);
  }
}
