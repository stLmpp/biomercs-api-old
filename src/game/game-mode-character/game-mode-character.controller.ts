import { Controller } from '@nestjs/common';
import { GameModeCharacterService } from './game-mode-character.service';
import { GameModeCharacter } from './game-mode-character.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModeCharacterAddDto } from './game-mode-character.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Game mode character')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-character')
export class GameModeCharacterController extends SuperController<
  GameModeCharacter
>({
  entity: GameModeCharacter,
  dto: {
    add: GameModeCharacterAddDto,
  },
  idKey: RouteParamId.idGameModeCharacter,
}) {
  constructor(private gameModeCharacterService: GameModeCharacterService) {
    super(gameModeCharacterService);
  }
}
