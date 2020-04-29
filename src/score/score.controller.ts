import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Score } from './score.entity';
import { ScoreService } from './score.service';

@ApiTags('Score')
@Roles(RoleEnum.user)
@Auth()
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get('top-score')
  getTopScore(
    @Query('idGame') idGame: number,
    @Query('idMode') idMode: number,
    @Query('idType') idType: number,
    @Query('idPlatform') idPlatform: number,
    @Query('idCharacter') idCharacter: number
  ): Promise<Score> {
    return this.scoreService.getTopScore(
      idGame,
      idMode,
      idType,
      idPlatform,
      idCharacter
    );
  }
}
