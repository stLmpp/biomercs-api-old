import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth.decorator';
import { Roles } from './role.guard';
import { RoleEnum } from './role.enum';
import { Role } from './role.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { GetUser } from '../get-user.decorator';
import { User } from '../user/user.entity';
import { SuperController } from '../../shared/super/super-controller';
import { RoleAddDto, RoleExistsDto, RoleUpdateDto } from './role.dto';

@ApiTags('Role')
@Roles(RoleEnum.admin)
@Auth()
@Controller('role')
export class RoleController extends SuperController<Role>({
  entity: Role,
  dto: {
    add: RoleAddDto,
    update: RoleUpdateDto,
    exists: RoleExistsDto,
  },
  idKey: RouteParamId.idRole,
  excludeMethods: ['findAll'],
  searchBy: ['name', 'description'],
}) {
  constructor(private roleService: RoleService) {
    super(roleService);
  }

  @Get()
  get(@GetUser() user: User): Promise<Role[]> {
    return this.roleService.get(user);
  }
}
