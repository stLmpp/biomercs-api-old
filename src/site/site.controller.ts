import { Controller } from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { RoleEnum } from '../auth/role/role.enum';
import {
  SuperController,
  SuperControllerRole,
} from '../shared/super/super-controller';
import { SiteAddDto, SiteUpdateDto } from './site.dto';
import { RouteParamEnum } from '../shared/types/route-enums';

@ApiTags('Site')
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
  idKey: RouteParamEnum.idSite,
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private siteService: SiteService) {
    super(siteService);
  }
}
