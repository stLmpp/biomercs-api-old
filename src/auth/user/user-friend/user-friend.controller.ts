import { Controller } from '@nestjs/common';
import { Auth } from '../../auth.decorator';
import { Roles } from '../../role/role.guard';
import { RoleEnum } from '../../role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { SuperController } from '../../../shared/super/super-controller';
import { UserFriend } from './user-friend.entity';
import { UserFriendService } from './user-friend.service';
import { UserFriendAddDto, UserFriendUpdateDto } from './user-friend.dto';
import { RouteParamEnum } from '../../../shared/types/route-enums';

@ApiTags('User Friend')
@Roles(RoleEnum.user)
@Auth()
@Controller('user-friend')
export class UserFriendController extends SuperController<UserFriend>({
  entity: UserFriend,
  dto: {
    add: UserFriendAddDto,
    update: UserFriendUpdateDto,
  },
  idKey: RouteParamEnum.idUserFriend,
  relations: ['user', 'friend'],
}) {
  constructor(private userFriendService: UserFriendService) {
    super(userFriendService);
  }
}
