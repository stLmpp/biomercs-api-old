import { Controller } from '@nestjs/common';
import { GameService } from './game.service';
import { Auth } from '../auth/auth.decorator';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Game } from './game.entity';
import { environment } from '../shared/env/env';
import {
  SuperController,
  SuperControllerRole,
} from '../shared/super/super-controller';
import { RouteParamEnum } from '../shared/types/route-enums';
import {
  GameAddDto,
  GameExistsDto,
  GameParamsDto,
  GameUpdateDto,
} from './game.dto';

@ApiTags('Game')
@Auth()
@Controller('game')
export class GameController extends SuperController<Game>({
  entity: Game,
  dto: {
    add: GameAddDto,
    update: GameUpdateDto,
    params: GameParamsDto,
    exists: GameExistsDto,
  },
  searchBy: ['name', 'shortName'],
  idKey: RouteParamEnum.idGame,
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private gameService: GameService) {
    super(gameService);
  }
}
