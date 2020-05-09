import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { Auth } from '../auth/auth.decorator';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { SuperController } from '../shared/super/super-controller';
import { LikeAddDto, LikeParamsDto, LikeUpdateDto } from './like.dto';
import { RouteParamId } from '../shared/types/route-enums';

@ApiTags('Like')
@Roles(RoleEnum.user)
@Auth()
@Controller('like')
export class LikeController extends SuperController<Like>({
  entity: Like,
  dto: {
    add: LikeAddDto,
    update: LikeUpdateDto,
    params: LikeParamsDto,
  },
  idKey: RouteParamId.idLike,
}) {
  constructor(private likeService: LikeService) {
    super(likeService);
  }
}
