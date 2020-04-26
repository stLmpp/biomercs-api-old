import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GameModeService } from './game-mode.service';
import { GameModeAddDto } from './dto/add.dto';
import { GameMode } from './game-mode.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { DeleteResult } from '../../util/types';

@ApiTags('Game mode')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode')
export class GameModeController {
  constructor(private gameModeService: GameModeService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: GameModeAddDto): Promise<GameMode> {
    return this.gameModeService.add(dto);
  }

  @Delete(`:${RouteParamId.idGameMode}`)
  delete(
    @Param(RouteParamId.idGameMode) idGameMode: number
  ): Promise<DeleteResult> {
    return this.gameModeService.delete(idGameMode);
  }
}
