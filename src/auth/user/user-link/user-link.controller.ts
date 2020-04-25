import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { UserLinkService } from './user-link.service';
import { RouteParamId } from '../../../shared/types/route-enums';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from '../../../util/types';
import { UserLinkUpdateDto } from './dto/update.dto';
import { UpdatedByPipe } from '../../../shared/pipes/updated-by.pipe';
import { Auth } from '../../auth.decorator';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';

@ApiTags('User link')
@Roles(RoleEnum.user)
@Auth()
@Controller('user-link')
export class UserLinkController {
  constructor(private userLinkService: UserLinkService) {}

  @Delete(`:${RouteParamId.idUserLink}`)
  delete(
    @Param(RouteParamId.idUserLink) idUserLink: number
  ): Promise<DeleteResult> {
    return this.userLinkService.delete(idUserLink);
  }

  @Patch(`:${RouteParamId.idUserLink}`)
  update(
    @Param(RouteParamId.idUserLink) idUserLink: number,
    @Body(UpdatedByPipe) dto: UserLinkUpdateDto
  ): Promise<UpdateResult> {
    return this.userLinkService.update(idUserLink, dto);
  }
}
