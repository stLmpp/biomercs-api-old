import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { StageService } from './stage.service';
import { StageAddDto } from './dto/add.dto';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { Stage } from './stage.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { StageUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';

@ApiTags('Stage')
@Roles(RoleEnum.admin)
@Auth()
@Controller('stage')
export class StageController {
  constructor(private stageService: StageService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: StageAddDto): Promise<Stage> {
    return this.stageService.add(dto);
  }

  @Patch(`:${RouteParamId.idStage}`)
  update(
    @Param(RouteParamId.idStage) idStage: number,
    @Body(UpdatedByPipe) dto: StageUpdateDto
  ): Promise<UpdateResult> {
    return this.stageService.update(idStage, dto);
  }
}
