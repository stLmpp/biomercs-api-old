import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './like.entity';
import { SuperService } from '../shared/super/super-service';
import { LikeAddDto, LikeUpdateDto } from './like.dto';

@Injectable()
export class LikeService extends SuperService<Like, LikeAddDto, LikeUpdateDto> {
  constructor(
    @InjectRepository(LikeRepository) private likeRepository: LikeRepository
  ) {
    super(Like, likeRepository);
  }
}
