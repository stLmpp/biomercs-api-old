import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { StageService } from './stage.service';
import { Stage } from './stage.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import { StageAddDto, StageParamsDto, StageUpdateDto } from './stage.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Stage')
@Auth()
@Controller('stage')
export class StageController extends SuperController<Stage>({
  entity: Stage,
  dto: {
    add: StageAddDto,
    update: StageUpdateDto,
    exists: StageParamsDto,
    params: StageParamsDto,
  },
  idKey: RouteParamEnum.idStage,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  relations: ['game'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private stageService: StageService) {
    super(stageService);
  }
}
