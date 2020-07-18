import { Injectable } from '@nestjs/common';
import { PlayerFollowerAddDto } from './player-follower.dto';
import { PlayerFollower } from './player-follower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperService } from '../../shared/super/super-service';
import { PlayerFollowerRepository } from './player-follower.repository';

@Injectable()
export class PlayerFollowerService extends SuperService<
  PlayerFollower,
  PlayerFollowerAddDto
> {
  constructor(
    @InjectRepository(PlayerFollowerRepository)
    private userFollowerRepository: PlayerFollowerRepository
  ) {
    super(PlayerFollower, userFollowerRepository);
  }
}
