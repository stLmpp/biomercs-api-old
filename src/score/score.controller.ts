import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreTable, ScoreViewModel } from './score.view-model';
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

  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  @Get('top-score')
  async getTopScore(
    @Query(RouteParamEnum.idGame) idGame: number,
    @Query(RouteParamEnum.idMode) idMode: number,
    @Query(RouteParamEnum.idType) idType: number,
    @Query(RouteParamEnum.idPlatform) idPlatform: number,
    @Query(RouteParamEnum.idCharacter) idCharacter: number,
    @Query(RouteParamEnum.idStage) idStage: number,
    @Query(RouteParamEnum.idPlayer) idPlayer?: number
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

  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  @Get('table-player')
  async getScoreTablePlayer(
    @Query(RouteParamEnum.idGame) idGame: number,
    @Query(RouteParamEnum.idMode) idMode: number,
    @Query(RouteParamEnum.idType) idType: number,
    @Query(RouteParamEnum.idPlatform) idPlatform: number,
    @Query(RouteParamEnum.idPlayer) idPlayer?: number
  ): Promise<ScoreTable[][]> {
    return this.scoreService.getScoreTablePlayer(
      idPlatform,
      idGame,
      idMode,
      idType,
      idPlayer
    );
  }

  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  @ApiQuery({ name: RouteParamEnum.limit, required: false })
  @Get('table-top')
  async getManyTopScore(
    @Query(RouteParamEnum.idPlatform) idPlatform: number,
    @Query(RouteParamEnum.idGame) idGame: number,
    @Query(RouteParamEnum.idMode) idMode: number,
    @Query(RouteParamEnum.idType) idType: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.limit) limit?: number
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

  @ApiQuery({ name: RouteParamEnum.idPlatform, required: false })
  @ApiQuery({ name: RouteParamEnum.idGame, required: false })
  @ApiQuery({ name: RouteParamEnum.idMode, required: false })
  @ApiQuery({ name: RouteParamEnum.idType, required: false })
  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({ name: RouteParamEnum.idStage, required: false })
  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  @Get('random')
  async getRandom(
    @Query(RouteParamEnum.idPlatform) idPlatform?: number,
    @Query(RouteParamEnum.idGame) idGame?: number,
    @Query(RouteParamEnum.idMode) idMode?: number,
    @Query(RouteParamEnum.idType) idType?: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.idStage) idStage?: number,
    @Query(RouteParamEnum.idPlayer) idPlayer?: number
  ): Promise<number> {
    return this.scoreService.random({
      idPlayer,
      idPlatform,
      idGame,
      idType,
      idStage,
      idMode,
      idCharacter,
    });
  }

  @Get(`:${RouteParamEnum.idScore}`)
  async findById(
    @Param(RouteParamEnum.idScore) idScore: number
  ): Promise<ScoreViewModel> {
    return this.scoreService.findById(idScore);
  }
}
