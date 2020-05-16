import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ModeService } from './mode.service';
import { Mode } from './mode.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import {
  ModeAddDto,
  ModeExistsDto,
  ModeParamsDto,
  ModeUpdateDto,
} from './mode.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Mode')
@Auth()
@Controller('mode')
export class ModeController extends SuperController<Mode>({
  entity: Mode,
  dto: {
    add: ModeAddDto,
    update: ModeUpdateDto,
    params: ModeParamsDto,
    exists: ModeExistsDto,
  },
  idKey: RouteParamEnum.idMode,
  searchBy: ['name'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private modeService: ModeService) {
    super(modeService);
  }
}
