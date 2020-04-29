import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { TypeService } from './type.service';
import { TypeAddDto } from './dto/add.dto';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { TypeUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { Type } from './type.entity';

@ApiTags('Type')
@Roles(RoleEnum.admin)
@Auth()
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: TypeAddDto): Promise<Type> {
    return this.typeService.add(dto);
  }

  @Patch(`:${RouteParamId.idType}`)
  update(
    @Param(RouteParamId.idType) idType: number,
    @Body(UpdatedByPipe) dto: TypeUpdateDto
  ): Promise<UpdateResult> {
    return this.typeService.update(idType, dto);
  }
}
