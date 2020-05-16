import { Controller } from '@nestjs/common';
import { UserLinkService } from './user-link.service';
import { RouteParamEnum } from '../../../shared/types/route-enums';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth.decorator';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';
import { SuperController } from '../../../shared/super/super-controller';
import { UserLink } from './user-link.entity';
import {
  UserLinkAddDto,
  UserLinkParamsDto,
  UserLinkUpdateDto,
} from './user-link.dto';

@ApiTags('User link')
@Roles(RoleEnum.user)
@Auth()
@Controller('user-link')
export class UserLinkController extends SuperController<UserLink>({
  entity: UserLink,
  dto: {
    add: UserLinkAddDto,
    update: UserLinkUpdateDto,
    params: UserLinkParamsDto,
  },
  idKey: RouteParamEnum.idUserLink,
  excludeMethods: ['findAll'],
}) {
  constructor(private userLinkService: UserLinkService) {
    super(userLinkService);
  }
}
