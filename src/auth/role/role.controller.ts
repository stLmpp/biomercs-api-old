import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth.decorator';
import { Roles } from './role.guard';
import { RoleEnum } from './role.enum';
import { Role } from './role.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RoleAddDto } from './dto/add.dto';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { RoleUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { GetUser } from '../get-user.decorator';
import { User } from '../user/user.entity';
import { ErrorMessage } from '../../shared/error/handle-error.filter';

export const RoleControllerPath = 'role';

@ApiTags('Role')
@Roles(RoleEnum.admin)
@Auth()
@Controller(RoleControllerPath)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: RoleAddDto): Promise<Role> {
    return this.roleService.add(dto);
  }

  @Patch(`:${RouteParamId.idRole}`)
  update(
    @Param(RouteParamId.idRole) idRole: number,
    @Body(UpdatedByPipe) dto: RoleUpdateDto
  ): Promise<UpdateResult> {
    return this.roleService.update(idRole, dto);
  }

  @Get()
  get(@GetUser() user: User): Promise<Role[]> {
    return this.roleService.get(user);
  }
}
