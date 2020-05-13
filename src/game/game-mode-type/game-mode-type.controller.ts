import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { SuperController } from '../../shared/super/super-controller';
import { GameModeType } from './game-mode-type.entity';
import { GameModeTypeAddDto } from './game-mode-type.dto';
import { RouteParamId } from '../../shared/types/route-enums';
import { GameModeTypeService } from './game-mode-type.service';

@ApiTags('Game Mode Type')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-type')
export class GameModeTypeController extends SuperController<GameModeType>({
  entity: GameModeType,
  dto: {
    add: GameModeTypeAddDto,
  },
  relations: ['gameMode', 'type', 'gameMode.game', 'gameMode.mode'],
  idKey: RouteParamId.idGameModeType,
}) {
  constructor(private gameModeTypeService: GameModeTypeService) {
    super(gameModeTypeService);
  }
}
