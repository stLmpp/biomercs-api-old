import { Controller } from '@nestjs/common';
import { GameService } from './game.service';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Game } from './game.entity';
import { environment } from '../shared/env/env';
import { SuperController } from '../shared/super/super-controller';
import { RouteParamId } from '../shared/types/route-enums';
import {
  GameAddDto,
  GameExistsDto,
  GameParamsDto,
  GameUpdateDto,
} from './game.dto';

@ApiTags('Game')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idGame,
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
}) {
  constructor(private gameService: GameService) {
    super(gameService);
  }
}
