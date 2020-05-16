import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { Platform } from './platform.entity';
import { environment } from '../../shared/env/env';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Platform')
@Auth()
@Controller('platform')
export class PlatformController extends SuperController<Platform>({
  entity: Platform,
  dto: {
    add: PlatformAddDto,
    update: PlatformUpdateDto,
    exists: PlatformUpdateDto,
    params: PlatformUpdateDto,
  },
  idKey: RouteParamEnum.idPlatform,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private platformService: PlatformService) {
    super(platformService);
  }
}
