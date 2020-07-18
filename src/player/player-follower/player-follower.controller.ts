import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/role/role.guard';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { SuperController } from '../../shared/super/super-controller';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { Controller } from '@nestjs/common';
import {
  PlayerFollowerAddDto,
  PlayerFollowerDeleteDto,
  PlayerFollowerExistsDto,
} from './player-follower.dto';
import { PlayerFollower } from './player-follower.entity';
import { PlayerFollowerService } from './player-follower.service';

@ApiTags('Player follower')
@Roles(RoleEnum.user)
@Auth()
@Controller('player-follower')
export class PlayerFollowerController extends SuperController<PlayerFollower>({
  entity: PlayerFollower,
  dto: {
    add: PlayerFollowerAddDto,
    exists: PlayerFollowerExistsDto,
    params: PlayerFollowerExistsDto,
    delete: PlayerFollowerDeleteDto,
  },
  idKey: RouteParamEnum.idPlayerFollower,
  relations: ['followed', 'follower'],
  excludeMethods: ['findAll'],
}) {
  constructor(private playerFollowerService: PlayerFollowerService) {
    super(playerFollowerService);
  }
}
