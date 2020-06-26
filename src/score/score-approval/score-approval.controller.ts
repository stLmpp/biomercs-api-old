import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ScoreApprovalService } from './score-approval.service';
import { ScoreApproval } from './score-approval.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import {
  ScoreApprovalAddDto,
  ScoreApprovalAddManyDto,
} from './score-approval.dto';
import { ScoreApprovalTypeEnum } from './score-approval-type.enum';

@ApiTags('Score approval')
@Auth()
@Controller('score-approval')
export class ScoreApprovalController {
  constructor(private scoreApprovalService: ScoreApprovalService) {}

  @Roles(RoleEnum.admin)
  @Post('admin')
  add(@Body(CreatedByPipe) dto: ScoreApprovalAddDto): Promise<ScoreApproval> {
    dto.type = ScoreApprovalTypeEnum.admin;
    return this.scoreApprovalService.add(dto);
  }

  @Roles(RoleEnum.user)
  @Post('user')
  addUser(
    @Body(CreatedByPipe) dto: ScoreApprovalAddDto
  ): Promise<ScoreApproval> {
    dto.type = ScoreApprovalTypeEnum.user;
    return this.scoreApprovalService.add(dto);
  }

  @Roles(RoleEnum.admin)
  @Post('admin/batch')
  addManyAdmin(
    @Body(CreatedByPipe) dto: ScoreApprovalAddManyDto
  ): Promise<ScoreApproval[]> {
    dto.type = ScoreApprovalTypeEnum.admin;
    return this.scoreApprovalService.many(dto);
  }

  @Roles(RoleEnum.user)
  @Post('user/batch')
  addManyUser(
    @Body(CreatedByPipe) dto: ScoreApprovalAddManyDto
  ): Promise<ScoreApproval[]> {
    dto.type = ScoreApprovalTypeEnum.user;
    return this.scoreApprovalService.many(dto);
  }
}
