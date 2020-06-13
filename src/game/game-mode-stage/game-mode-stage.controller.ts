import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { SuperController } from '../../shared/super/super-controller';
import { GameModeStage } from './game-mode-stage.entity';
import {
  GameModeStageAddDto,
  GameModeStageParamsDto,
  GameModeStageUpdateDto,
} from './game-mode-stage.dto';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { GameModeStageService } from './game-mode-stage.service';

@ApiTags('Game mode stage')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-stage')
export class GameModeStageController extends SuperController<GameModeStage>({
  entity: GameModeStage,
  dto: {
    add: GameModeStageAddDto,
    update: GameModeStageUpdateDto,
    params: GameModeStageParamsDto,
  },
  idKey: RouteParamEnum.idGameModeStage,
  relations: ['stage'],
}) {
  constructor(private gameModeStageService: GameModeStageService) {
    super(gameModeStageService);
  }
}
