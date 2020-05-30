import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreTable } from './score.view-model';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { ScoreAddDto } from './score.dto';
import { RouteParamEnum } from '../shared/types/route-enums';

@ApiTags('Score')
@Roles(RoleEnum.user)
@Auth()
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Post()
  async add(@Body(CreatedByPipe) dto: ScoreAddDto): Promise<Score> {
    return await this.scoreService.add(dto);
  }

  @ApiQuery({ name: 'idPlayer', required: false })
  @Get('top-score')
  async getTopScore(
    @Query('idGame') idGame: number,
    @Query('idMode') idMode: number,
    @Query('idType') idType: number,
    @Query('idPlatform') idPlatform: number,
    @Query('idCharacter') idCharacter: number,
    @Query('idStage') idStage: number,
    @Query('idPlayer') idPlayer?: number
  ): Promise<Score> {
    return this.scoreService.getTopScore({
      idGame,
      idMode,
      idType,
      idPlatform,
      idCharacter,
      idStage,
      idPlayer,
    });
  }

  @ApiQuery({ name: 'idPlayer', required: false })
  @Get('table-player')
  async getScoreTablePlayer(
    @Query('idGame') idGame: number,
    @Query('idMode') idMode: number,
    @Query('idType') idType: number,
    @Query('idPlatform') idPlatform: number,
    @Query('idPlayer') idPlayer?: number
  ): Promise<ScoreTable[][]> {
    return this.scoreService.getScoreTablePlayer(
      idPlatform,
      idGame,
      idMode,
      idType,
      idPlayer
    );
  }

  @ApiQuery({ name: 'idCharacter', required: false })
  @ApiQuery({ name: 'idPlayer', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('table-top')
  async getManyTopScore(
    @Query('idPlatform') idPlatform: number,
    @Query('idGame') idGame: number,
    @Query('idMode') idMode: number,
    @Query('idType') idType: number,
    @Query('idCharacter') idCharacter?: number,
    @Query('limit') limit?: number
  ): Promise<ScoreTable[][]> {
    return this.scoreService.getManyTopScore(
      idPlatform,
      idGame,
      idMode,
      idType,
      limit || 10,
      idCharacter
    );
  }

  @Get('random')
  async getRandom(): Promise<number> {
    return this.scoreService.random();
  }

  @Get(`:${RouteParamEnum.idScore}`)
  async findById(
    @Param(RouteParamEnum.idScore) idScore: number
  ): Promise<Score> {
    return this.scoreService.findById(idScore);
  }
}
