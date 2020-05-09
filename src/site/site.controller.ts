import { Controller } from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { SuperController } from '../shared/super/super-controller';
import { SiteAddDto, SiteUpdateDto } from './site.dto';
import { RouteParamId } from '../shared/types/route-enums';

@ApiTags('Site')
@Roles(RoleEnum.admin)
@Auth()
@Controller('site')
export class SiteController extends SuperController<Site>({
  entity: Site,
  dto: {
    add: SiteAddDto,
    update: SiteUpdateDto,
    exists: SiteUpdateDto,
    params: SiteUpdateDto,
  },
  searchBy: ['name', 'url'],
  idKey: RouteParamId.idSite,
}) {
  constructor(private siteService: SiteService) {
    super(siteService);
  }
}
