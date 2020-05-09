import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ModeService } from './mode.service';
import { Mode } from './mode.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import {
  ModeAddDto,
  ModeExistsDto,
  ModeParamsDto,
  ModeUpdateDto,
} from './mode.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Mode')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idMode,
  searchBy: ['name'],
}) {
  constructor(private modeService: ModeService) {
    super(modeService);
  }
}
