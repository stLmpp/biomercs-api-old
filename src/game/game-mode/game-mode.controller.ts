import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModeService } from './game-mode.service';
import { GameMode } from './game-mode.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import { GameModeAddDto } from './game-mode.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Game mode')
@Auth()
@Controller('game-mode')
export class GameModeController extends SuperController<GameMode>({
  entity: GameMode,
  dto: {
    add: GameModeAddDto,
  },
  idKey: RouteParamEnum.idGameMode,
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  relations: ['game', 'mode'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private gameModeService: GameModeService) {
    super(gameModeService);
  }
}
