import { Body, Controller, Param, Patch } from '@nestjs/common';
import { Auth } from '../../auth.decorator';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { UserShowcaseService } from './user-showcase.service';
import { UpdateResult } from '../../../util/types';
import { UpdatedByPipe } from '../../../shared/pipes/updated-by.pipe';
import { UserShowcaseUpdateDto } from './user-showcase.dto';

@ApiTags('User Showcase')
@Roles(RoleEnum.user)
@Auth()
@Controller('user-showcase')
export class UserShowcaseController {
  constructor(private userShowcaseService: UserShowcaseService) {}

  @Patch(':idUserShowcase')
  async update(
    @Param('idUserShowcase') idUserShowcase: number,
    @Body(UpdatedByPipe) dto: UserShowcaseUpdateDto
  ): Promise<UpdateResult> {
    return this.userShowcaseService.update(idUserShowcase, dto);
  }
}
