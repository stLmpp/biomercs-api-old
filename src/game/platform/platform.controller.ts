import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { RouteParamId } from '../../shared/types/route-enums';
import { Platform } from './platform.entity';
import { environment } from '../../shared/env/env';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Platform')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idPlatform,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
}) {
  constructor(private platformService: PlatformService) {
    super(platformService);
  }
}
