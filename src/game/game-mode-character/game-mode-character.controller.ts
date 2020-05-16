import { Controller } from '@nestjs/common';
import { GameModeCharacterService } from './game-mode-character.service';
import { GameModeCharacter } from './game-mode-character.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModeCharacterAddDto } from './game-mode-character.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Game mode character')
@Auth()
@Controller('game-mode-character')
export class GameModeCharacterController extends SuperController<
  GameModeCharacter
>({
  entity: GameModeCharacter,
  dto: {
    add: GameModeCharacterAddDto,
  },
  idKey: RouteParamEnum.idGameModeCharacter,
  relations: ['gameMode', 'gameMode.game', 'gameMode.mode'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private gameModeCharacterService: GameModeCharacterService) {
    super(gameModeCharacterService);
  }
}
