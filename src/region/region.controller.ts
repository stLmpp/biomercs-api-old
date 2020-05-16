import { Controller } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import {
  SuperController,
  SuperControllerRole,
} from '../shared/super/super-controller';
import { Region } from './region.entity';
import { RegionAddDto, RegionExistsDto, RegionUpdateDto } from './region.dto';
import { RegionService } from './region.service';

@ApiTags('Region')
@Auth()
@Controller('region')
export class RegionController extends SuperController<Region>({
  entity: Region,
  dto: {
    add: RegionAddDto,
    update: RegionUpdateDto,
    exists: RegionExistsDto,
    params: RegionExistsDto,
  },
  searchBy: ['name', 'shortName'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private regionService: RegionService) {
    super(regionService);
  }
}
