import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModePlatformService } from './game-mode-platform.service';
import { GameModePlatform } from './game-mode-platform.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { GameModePlatformAddDto } from './game-mode-platform.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Game mode platform')
@Auth()
@Controller('game-mode-platform')
export class GameModePlatformController extends SuperController<
  GameModePlatform
>({
  entity: GameModePlatform,
  dto: {
    add: GameModePlatformAddDto,
  },
  idKey: RouteParamEnum.idGameModePlatform,
  relations: ['gameMode', 'platform', 'gameMode.game', 'gameMode.mode'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private gameModePlatformService: GameModePlatformService) {
    super(gameModePlatformService);
  }
}
