import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { StageService } from './stage.service';
import { Stage } from './stage.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import { StageAddDto, StageParamsDto, StageUpdateDto } from './stage.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Stage')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idStage,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
}) {
  constructor(private stageService: StageService) {
    super(stageService);
  }
}
