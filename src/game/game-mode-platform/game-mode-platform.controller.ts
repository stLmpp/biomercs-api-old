import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModePlatformService } from './game-mode-platform.service';
import { GameModePlatform } from './game-mode-platform.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { GameModePlatformAddDto } from './game-mode-platform.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Game mode platform')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-platform')
export class GameModePlatformController extends SuperController<
  GameModePlatform
>({
  entity: GameModePlatform,
  dto: {
    add: GameModePlatformAddDto,
  },
  idKey: RouteParamId.idGameModePlatform,
  relations: ['gameMode', 'platform', 'gameMode.game', 'gameMode.mode'],
}) {
  constructor(private gameModePlatformService: GameModePlatformService) {
    super(gameModePlatformService);
  }
}
