import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';
import { Reason } from './reason.entity';
import { ReasonAddDto, ReasonUpdateDto } from './reason.dto';
import { RoleEnum } from '../../auth/role/role.enum';
import { ReasonService } from './reason.service';

@ApiTags('Reason')
@Auth()
@Controller('reason')
export class ReasonController extends SuperController<Reason>({
  entity: Reason,
  dto: {
    add: ReasonAddDto,
    update: ReasonUpdateDto,
  },
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
  searchBy: ['description'],
}) {
  constructor(private reasonService: ReasonService) {
    super(reasonService);
  }
}
