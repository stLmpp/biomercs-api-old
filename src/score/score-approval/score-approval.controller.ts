import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ScoreApprovalService } from './score-approval.service';
import { ScoreApproval } from './score-approval.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { ScoreApprovalAddDto } from './score-approval.dto';

@ApiTags('Score approval')
@Roles(RoleEnum.admin)
@Auth()
@Controller('score-approval')
export class ScoreApprovalController {
  constructor(private scoreApprovalService: ScoreApprovalService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: ScoreApprovalAddDto): Promise<ScoreApproval> {
    return this.scoreApprovalService.add(dto);
  }
}
