import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModeService } from './game-mode.service';
import { GameMode } from './game-mode.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import { GameModeAddDto } from './game-mode.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Game mode')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode')
export class GameModeController extends SuperController<GameMode>({
  entity: GameMode,
  dto: {
    add: GameModeAddDto,
  },
  idKey: RouteParamId.idGameMode,
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  relations: ['game', 'mode'],
}) {
  constructor(private gameModeService: GameModeService) {
    super(gameModeService);
  }
}
