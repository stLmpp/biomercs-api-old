import { Body, Controller, Param, Patch, Put } from '@nestjs/common';
import { Auth } from '../auth.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from '../../util/types';
import { UserService } from './user.service';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { UserUpdateDto } from './dto/update.dto';
import { UserLinkService } from './user-link/user-link.service';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { UserLinkAddDto } from './user-link/dto/add.dto';
import { UserLink } from './user-link/user-link.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { Roles } from '../role/role.guard';
import { RoleEnum } from '../role/role.enum';

@ApiTags('User')
@Roles(RoleEnum.admin, RoleEnum.user)
@Auth()
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userLinkService: UserLinkService
  ) {}

  @Patch(`:${RouteParamId.idUser}`)
  update(
    @Param(RouteParamId.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserUpdateDto
  ): Promise<UpdateResult> {
    return this.userService.update(idUser, dto);
  }

  @Put(`:${RouteParamId.idUser}/user-link`)
  addLink(
    @Param(RouteParamId.idUser) idUser: number,
    @Body(CreatedByPipe) dto: UserLinkAddDto
  ): Promise<UserLink> {
    return this.userLinkService.add(idUser, dto);
  }

  @Put(`:${RouteParamId.idUser}/user-links`)
  @ApiBody({ isArray: true, type: UserLinkAddDto })
  addLinks(
    @Param(RouteParamId.idUser) idUser: number,
    @Body(CreatedByPipe) dto: UserLinkAddDto[]
  ): Promise<UserLink[]> {
    return this.userLinkService.addMany(idUser, dto);
  }
}
