import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModePlatformService } from './game-mode-platform.service';
import { GameModePlatform } from './game-mode-platform.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { GameModePlatformAddDto } from './dto/add.dto';
import { RouteParamId } from '../../shared/types/route-enums';
import { DeleteResult } from '../../util/types';

@ApiTags('Game mode platform')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-platform')
export class GameModePlatformController {
  constructor(private gameModePlatformService: GameModePlatformService) {}

  @Post()
  add(
    @Body(CreatedByPipe) dto: GameModePlatformAddDto
  ): Promise<GameModePlatform> {
    return this.gameModePlatformService.add(dto);
  }

  @Delete(`:${RouteParamId.idGameModePlatform}`)
  delete(
    @Param(RouteParamId.idGameModePlatform) idGameModePlatform: number
  ): Promise<DeleteResult> {
    return this.gameModePlatformService.delete(idGameModePlatform);
  }
}
