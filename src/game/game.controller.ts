import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { RouteParamId } from '../shared/types/route-enums';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { UpdateResult } from '../util/types';
import { Game } from './game.entity';
import { GameUpdateDto } from './dto/update.dto';
import { GameAddDto } from './dto/add.dto';

@ApiTags('Game')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: GameAddDto): Promise<Game> {
    return this.gameService.add(dto);
  }

  @Patch(`:${RouteParamId.idGame}`)
  update(
    @Param(RouteParamId.idGame) idGame: number,
    @Body(UpdatedByPipe) dto: GameUpdateDto
  ): Promise<UpdateResult> {
    return this.gameService.update(idGame, dto);
  }
}
