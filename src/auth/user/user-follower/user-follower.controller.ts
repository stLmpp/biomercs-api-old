import { Controller } from '@nestjs/common';
import { Auth } from '../../auth.decorator';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { SuperController } from '../../../shared/super/super-controller';
import { UserFollower } from './user-follower.entity';
import { UserFollowerService } from './user-follower.service';
import { UserFollowerAddDto } from './user-follower.dto';
import { RouteParamEnum } from '../../../shared/types/route-enums';

@ApiTags('User follower')
@Roles(RoleEnum.user)
@Auth()
@Controller('user-follower')
export class UserFollowerController extends SuperController<UserFollower>({
  entity: UserFollower,
  dto: {
    add: UserFollowerAddDto,
  },
  idKey: RouteParamEnum.idUserFollower,
  relations: ['user', 'follower'],
}) {
  constructor(private userFollowerService: UserFollowerService) {
    super(userFollowerService);
  }
}
