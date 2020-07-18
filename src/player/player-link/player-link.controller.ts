import { Controller } from '@nestjs/common';
import { PlayerLinkService } from './player-link.service';
import { PlayerLink } from './player-link.entity';
import {
  PlayerLinkAddDto,
  PlayerLinkParamsDto,
  PlayerLinkUpdateDto,
} from './player-link.dto';
import { SuperController } from '../../shared/super/super-controller';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { Auth } from '../../auth/auth.decorator';
import { RouteParamEnum } from '../../shared/types/route-enums';

@ApiTags('Player link')
@Roles(RoleEnum.user)
@Auth()
@Controller('player-link')
export class PlayerLinkController extends SuperController<PlayerLink>({
  entity: PlayerLink,
  dto: {
    add: PlayerLinkAddDto,
    update: PlayerLinkUpdateDto,
    params: PlayerLinkParamsDto,
  },
  idKey: RouteParamEnum.idPlayerLink,
  excludeMethods: ['findAll'],
  relations: ['site'],
}) {
  constructor(private playerLinkService: PlayerLinkService) {
    super(playerLinkService);
  }
}
