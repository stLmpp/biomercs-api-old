import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { Auth } from '../auth/auth.decorator';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { SuperController } from '../shared/super/super-controller';
import {
  LikeAddDto,
  LikeDeteteDto,
  LikeParamsDto,
  LikeUpdateDto,
} from './like.dto';
import { RouteParamEnum } from '../shared/types/route-enums';
import { LikeCountViewModel } from './like.view-model';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';

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
    exists: LikeParamsDto,
    count: LikeParamsDto,
    delete: LikeDeteteDto,
  },
  idKey: RouteParamEnum.idLike,
  excludeMethods: ['findAll'],
}) {
  constructor(private likeService: LikeService) {
    super(likeService);
  }

  @Get(`count-all`)
  findCountForAll(
    @Query(RouteParamEnum.idReference) idReference: number,
    @Query(RouteParamEnum.type) type: ReferenceTypeEnum
  ): Promise<LikeCountViewModel> {
    return this.likeService.findCountForAll(type, idReference);
  }
}
