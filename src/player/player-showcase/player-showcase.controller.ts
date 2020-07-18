import { ApiTags } from '@nestjs/swagger';
import { PlayerShowcaseService } from './player-showcase.service';
import { PlayerShowcase } from './player-showcase.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { Roles } from '../../auth/role/role.guard';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { PlayerShowcaseUpdateDto } from './player-showcase.dto';

@ApiTags('Player Showcase')
@Roles(RoleEnum.user)
@Auth()
@Controller('player-showcase')
export class PlayerShowcaseController {
  constructor(private playerShowcaseService: PlayerShowcaseService) {}

  @Patch(`:${RouteParamEnum.idPlayerShowcase}`)
  async update(
    @Param(RouteParamEnum.idPlayerShowcase) idPlayerShowcase: number,
    @Body(UpdatedByPipe) dto: PlayerShowcaseUpdateDto
  ): Promise<PlayerShowcase> {
    return this.playerShowcaseService.update(idPlayerShowcase, dto);
  }
}
