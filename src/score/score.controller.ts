import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import {
  ScoreIsWrViewModel,
  ScoreTable,
  ScoreViewModel,
} from './score.view-model';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { ScoreAddDto, ScoreIsWrDto } from './score.dto';
import { RouteParamEnum } from '../shared/types/route-enums';
import { CheckParamsPipe } from '../shared/pipes/check-params.pipe';
import { Pagination } from 'nestjs-typeorm-paginate/index';
import { ParseDatePipe } from '../shared/pipes/parse-date.pipe';
import { ApiPagination } from '../shared/decorator/api-pagination';
import { matrixSchema } from '../shared/decorator/api-matrix';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user/user.entity';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { ApiQueryEnum } from '../shared/decorator/api-query-enum';
import { OrderByDirection } from '../util/types';
import { isAdmin } from '../auth/role/role.service';

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

  @Post('is-wr')
  async isWr(
    @Body(CheckParamsPipe) dto: ScoreIsWrDto
  ): Promise<ScoreIsWrViewModel> {
    return this.scoreService.isWr(dto);
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
  @ApiOkResponse({ schema: matrixSchema(ScoreViewModel) })
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
  @ApiOkResponse({ schema: matrixSchema(ScoreViewModel) })
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

  @ApiQueryEnum({ name: RouteParamEnum.idScoreStatus, enum: ScoreStatusEnum })
  @ApiQuery({ name: RouteParamEnum.idPlatform, required: false })
  @ApiQuery({ name: RouteParamEnum.idGame, required: false })
  @ApiQuery({ name: RouteParamEnum.idMode, required: false })
  @ApiQuery({ name: RouteParamEnum.idType, required: false })
  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({ name: RouteParamEnum.idStage, required: false })
  @ApiQuery({ name: RouteParamEnum.idStages, required: false })
  @ApiQuery({ name: RouteParamEnum.startDate, required: false })
  @ApiQuery({ name: RouteParamEnum.endDate, required: false })
  @ApiQuery({ name: RouteParamEnum.orderBy, required: false })
  @ApiQuery({
    name: RouteParamEnum.orderByDirection,
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiPagination(ScoreViewModel)
  @Roles(RoleEnum.admin)
  @Get('approval-list')
  async findScoresApproval(
    @Query(RouteParamEnum.idScoreStatus) idScoreStatus: number,
    @Query(RouteParamEnum.page) page: number,
    @Query(RouteParamEnum.idPlatform) idPlatform?: number,
    @Query(RouteParamEnum.idGame) idGame?: number,
    @Query(RouteParamEnum.idMode) idMode?: number,
    @Query(RouteParamEnum.idType) idType?: number,
    @Query(RouteParamEnum.idPlayer) idPlayer?: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.idStage) idStage?: number,
    @Query(RouteParamEnum.idStages, new ParseArrayPipe({ optional: true }))
    idStages?: number[],
    @Query(RouteParamEnum.startDate, ParseDatePipe) startDate?: Date,
    @Query(RouteParamEnum.endDate, ParseDatePipe) endDate?: Date,
    @Query(RouteParamEnum.orderBy) orderBy?: string,
    @Query(RouteParamEnum.orderByDirection) orderByDirection?: OrderByDirection
  ): Promise<Pagination<ScoreViewModel>> {
    return this.scoreService.findScoresApproval(
      {
        idPlayer,
        idType,
        idPlatform,
        idMode,
        idGame,
        startDate,
        endDate,
        idScoreStatus,
        idStage,
        idCharacter,
      },
      page,
      orderBy,
      orderByDirection
    );
  }

  @ApiQueryEnum({ name: RouteParamEnum.idScoreStatus, enum: ScoreStatusEnum })
  @ApiQuery({ name: RouteParamEnum.idPlatform, required: false })
  @ApiQuery({ name: RouteParamEnum.idGame, required: false })
  @ApiQuery({ name: RouteParamEnum.idMode, required: false })
  @ApiQuery({ name: RouteParamEnum.idType, required: false })
  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({ name: RouteParamEnum.idStage, required: false })
  @ApiQuery({ name: RouteParamEnum.startDate, required: false })
  @ApiQuery({ name: RouteParamEnum.endDate, required: false })
  @ApiQuery({ name: RouteParamEnum.orderBy, required: false })
  @ApiQuery({
    name: RouteParamEnum.orderByDirection,
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiPagination(ScoreViewModel)
  @Roles(RoleEnum.admin)
  @Get('approval-list/user')
  async findScoresApprovalUser(
    @GetUser() user: User,
    @Query(RouteParamEnum.idScoreStatus) idScoreStatus: number,
    @Query(RouteParamEnum.page) page: number,
    @Query(RouteParamEnum.idPlatform) idPlatform?: number,
    @Query(RouteParamEnum.idGame) idGame?: number,
    @Query(RouteParamEnum.idMode) idMode?: number,
    @Query(RouteParamEnum.idType) idType?: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.idStage) idStage?: number,
    @Query(RouteParamEnum.startDate, ParseDatePipe) startDate?: Date,
    @Query(RouteParamEnum.endDate, ParseDatePipe) endDate?: Date,
    @Query(RouteParamEnum.orderBy) orderBy?: string,
    @Query(RouteParamEnum.orderByDirection) orderByDirection?: OrderByDirection
  ): Promise<Pagination<ScoreViewModel>> {
    return this.scoreService.findScoresApproval(
      {
        idPlayer: user.id,
        idType,
        idPlatform,
        idMode,
        idGame,
        startDate,
        endDate,
        idScoreStatus,
        idCharacter,
        idStage,
      },
      page,
      orderBy,
      orderByDirection
    );
  }

  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({
    name: RouteParamEnum.idCharacters,
    required: false,
    isArray: true,
    type: Number,
  })
  @ApiQuery({ name: RouteParamEnum.idCharactersAnd, required: false })
  @Get('require-approval')
  async requireApproval(
    @Query(RouteParamEnum.score) score: number,
    @Query(RouteParamEnum.maxCombo) maxCombo: number,
    @Query(RouteParamEnum.time) time: string,
    @Query(RouteParamEnum.idPlatform) idPlatform: number,
    @Query(RouteParamEnum.idGame) idGame: number,
    @Query(RouteParamEnum.idMode) idMode: number,
    @Query(RouteParamEnum.idType) idType: number,
    @Query(RouteParamEnum.idStage) idStage: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.idCharacters, new ParseArrayPipe({ optional: true }))
    idCharacters?: number[],
    @Query(RouteParamEnum.idCharactersAnd) idCharactersAnd?: boolean
  ): Promise<boolean> {
    if (!idCharacter && !idCharacters?.length) {
      throw new BadRequestException(
        '[idCharacter] or [idCharacters] must have a value'
      );
    }
    return this.scoreService.requireApproval({
      idPlatform,
      idGame,
      idMode,
      idType,
      idStage,
      idCharacter,
      idCharacters,
      maxCombo,
      time,
      score,
      idCharactersAnd,
    });
  }

  @ApiQueryEnum({
    name: RouteParamEnum.idScoreStatus,
    enum: ScoreStatusEnum,
    required: false,
  })
  @ApiQuery({ name: RouteParamEnum.idPlatform, required: false })
  @ApiQuery({ name: RouteParamEnum.idGame, required: false })
  @ApiQuery({ name: RouteParamEnum.idMode, required: false })
  @ApiQuery({ name: RouteParamEnum.idType, required: false })
  @ApiQuery({ name: RouteParamEnum.idCharacter, required: false })
  @ApiQuery({ name: RouteParamEnum.idStage, required: false })
  @ApiQuery({ name: RouteParamEnum.startDate, required: false })
  @ApiQuery({ name: RouteParamEnum.endDate, required: false })
  @Get('count-approval')
  async countApproval(
    @GetUser() user: User,
    @Query(RouteParamEnum.idScoreStatus) idScoreStatus?: number,
    @Query(RouteParamEnum.idPlatform) idPlatform?: number,
    @Query(RouteParamEnum.idGame) idGame?: number,
    @Query(RouteParamEnum.idMode) idMode?: number,
    @Query(RouteParamEnum.idType) idType?: number,
    @Query(RouteParamEnum.idCharacter) idCharacter?: number,
    @Query(RouteParamEnum.idStage) idStage?: number,
    @Query(RouteParamEnum.startDate, ParseDatePipe) startDate?: Date,
    @Query(RouteParamEnum.endDate, ParseDatePipe) endDate?: Date
  ): Promise<number> {
    return this.scoreService.countApprovals({
      idStage,
      idPlatform,
      idGame,
      idType,
      idCharacter,
      idScoreStatus,
      endDate,
      startDate,
      idMode,
      idPlayer: user.id,
    });
  }

  @Get(`:${RouteParamEnum.idScore}`)
  async findById(
    @Param(RouteParamEnum.idScore) idScore: number
  ): Promise<ScoreViewModel> {
    return this.scoreService.findById(idScore);
  }

  @Get(`:${RouteParamEnum.idScore}/can-activate`)
  async canActivateScore(
    @GetUser() user: User,
    @Param(RouteParamEnum.idScore) idScore: number
  ): Promise<boolean> {
    return (
      isAdmin(user) ||
      (await this.scoreService.canActivateScore(idScore, user.id))
    );
  }
}
