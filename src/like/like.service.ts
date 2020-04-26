import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './like.entity';
import { LikeAddDto } from './dto/add.dto';
import { DeleteResult, UpdateResult } from '../util/types';
import { LikeUpdateDto } from './dto/update.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository) private likeRepository: LikeRepository
  ) {}

  async add(dto: LikeAddDto): Promise<Like> {
    return await this.likeRepository.save(new Like().extendDto(dto));
  }

  async update(idLike: number, dto: LikeUpdateDto): Promise<UpdateResult> {
    return await this.likeRepository.update(idLike, dto);
  }

  async delete(idLike: number): Promise<DeleteResult> {
    return await this.likeRepository.delete(idLike);
  }
}
