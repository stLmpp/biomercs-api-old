import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ScorePlayerService } from './score-player.service';
import { SuperController } from '../../shared/super/super-controller';
import { ScorePlayer } from './score-player.entity';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player.dto';
import { RouteParamId } from '../../shared/types/route-enums';

@ApiTags('Score player')
@Roles(RoleEnum.user)
@Auth()
@Controller('score-player')
export class ScorePlayerController extends SuperController<ScorePlayer>({
  entity: ScorePlayer,
  dto: {
    add: ScorePlayerAddDto,
    update: ScorePlayerUpdateDto,
  },
  idKey: RouteParamId.idScorePlayer,
  excludeMethods: ['findAll'],
}) {
  constructor(private scorePlayerService: ScorePlayerService) {
    super(scorePlayerService);
  }
}
