import { Injectable } from '@nestjs/common';
import { UserFriendRepository } from './user-friend.repository';
import { SuperService } from '../../../shared/super/super-service';
import { UserFriendAddDto, UserFriendUpdateDto } from './user-friend.dto';
import { UserFriend } from './user-friend.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserFriendService extends SuperService<
  UserFriend,
  UserFriendAddDto,
  UserFriendUpdateDto
> {
  constructor(
    @InjectRepository(UserFriendRepository)
    private userFriendRepository: UserFriendRepository
  ) {
    super(UserFriend, userFriendRepository);
  }
}
