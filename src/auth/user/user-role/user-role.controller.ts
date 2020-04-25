import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { Auth } from '../../auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../../../shared/pipes/created-by.pipe';
import { UserRoleAddDto } from './dto/add.dto';
import { UserRole } from './user-role.entity';
import { RouteParamId } from '../../../shared/types/route-enums';
import { DeleteResult } from '../../../util/types';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';

@ApiTags('User role')
@Roles(RoleEnum.admin)
@Auth()
@Controller('user-role')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: UserRoleAddDto): Promise<UserRole> {
    return this.userRoleService.add(dto.idUser, dto.idRole);
  }

  @Delete(`:${RouteParamId.idUserRole}`)
  delete(
    @Param(RouteParamId.idUserRole) idUserRole: number
  ): Promise<DeleteResult> {
    return this.userRoleService.delete(idUserRole);
  }
}
