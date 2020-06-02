import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './like.entity';
import { SuperService } from '../shared/super/super-service';
import { LikeAddDto, LikeUpdateDto } from './like.dto';
import { LikeCountViewModel } from './like.view-model';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';
import { LikeStyleEnum } from './like-style.enum';

@Injectable()
export class LikeService extends SuperService<Like, LikeAddDto, LikeUpdateDto> {
  constructor(
    @InjectRepository(LikeRepository) private likeRepository: LikeRepository
  ) {
    super(Like, likeRepository);
  }

  async findCountForAll(
    type: ReferenceTypeEnum,
    idReference: number
  ): Promise<LikeCountViewModel> {
    const likeCountVw = new LikeCountViewModel();
    likeCountVw.like = await this.countByParams({
      type,
      idReference,
      style: LikeStyleEnum.like,
    });
    likeCountVw.love = await this.countByParams({
      type,
      idReference,
      style: LikeStyleEnum.love,
    });
    return likeCountVw;
  }
}
