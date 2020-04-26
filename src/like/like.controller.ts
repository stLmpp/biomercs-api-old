import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { Auth } from '../auth/auth.decorator';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { LikeAddDto } from './dto/add.dto';
import { RouteParamId } from '../shared/types/route-enums';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { LikeUpdateDto } from './dto/update.dto';
import { DeleteResult, UpdateResult } from '../util/types';

@ApiTags('Like')
@Roles(RoleEnum.user)
@Auth()
@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: LikeAddDto): Promise<Like> {
    return this.likeService.add(dto);
  }

  @Patch(`:${RouteParamId.idLike}`)
  update(
    @Param(RouteParamId.idLike) idLike: number,
    @Body(UpdatedByPipe) dto: LikeUpdateDto
  ): Promise<UpdateResult> {
    return this.likeService.update(idLike, dto);
  }

  @Delete(`:${RouteParamId.idLike}`)
  delete(@Param(RouteParamId.idLike) idLike: number): Promise<DeleteResult> {
    return this.likeService.delete(idLike);
  }
}
