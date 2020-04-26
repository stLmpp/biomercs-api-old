import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { GameModeCharacterService } from './game-mode-character.service';
import { GameModeCharacterAddDto } from './dto/add.dto';
import { GameModeCharacter } from './game-mode-character.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { DeleteResult } from '../../util/types';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game mode character')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode-character')
export class GameModeCharacterController {
  constructor(private gameModeCharacterService: GameModeCharacterService) {}

  @Post()
  add(
    @Body(CreatedByPipe) dto: GameModeCharacterAddDto
  ): Promise<GameModeCharacter> {
    return this.gameModeCharacterService.add(dto);
  }

  @Delete(`:${RouteParamId.idGameModeCharacter}`)
  delete(
    @Param(RouteParamId.idGameModeCharacter) idGameModeCharacter: number
  ): Promise<DeleteResult> {
    return this.gameModeCharacterService.delete(idGameModeCharacter);
  }
}
