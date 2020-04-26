import { EntityRepository } from 'typeorm';
import { Like } from './like.entity';
import { CustomRepository } from '../shared/types/custom-repository';

@EntityRepository(Like)
export class LikeRepository extends CustomRepository<Like> {}
