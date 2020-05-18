import { Injectable } from '@nestjs/common';
import { UserFollowerRepository } from './user-follower.repository';
import { SuperService } from '../../../shared/super/super-service';
import { UserFollowerAddDto } from './user-follower.dto';
import { UserFollower } from './user-follower.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserFollowerService extends SuperService<
  UserFollower,
  UserFollowerAddDto
> {
  constructor(
    @InjectRepository(UserFollowerRepository)
    private userFollowerRepository: UserFollowerRepository
  ) {
    super(UserFollower, userFollowerRepository);
  }
}
