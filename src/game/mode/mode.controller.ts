import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ModeService } from './mode.service';
import { ModeAddDto } from './dto/add.dto';
import { ModeUpdateDto } from './dto/update.dto';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { Mode } from './mode.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { UpdateResult } from '../../util/types';

@ApiTags('Mode')
@Roles(RoleEnum.admin)
@Auth()
@Controller('mode')
export class ModeController {
  constructor(private modeService: ModeService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: ModeAddDto): Promise<Mode> {
    return this.modeService.add(dto);
  }

  @Patch(`:${RouteParamId.idMode}`)
  update(
    @Param(RouteParamId.idMode) idMode: number,
    @Body(UpdatedByPipe) dto: ModeUpdateDto
  ): Promise<UpdateResult> {
    return this.modeService.update(idMode, dto);
  }

  @Get()
  findAll(): Promise<Mode[]> {
    return this.modeService.findAll();
  }
}
