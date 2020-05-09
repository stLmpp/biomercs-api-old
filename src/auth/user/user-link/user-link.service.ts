import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLinkRepository } from './user-link.repository';
import { UserLinkAddDto, UserLinkUpdateDto } from './user-link.dto';
import { UserLink } from './user-link.entity';
import { SuperService } from '../../../shared/super/super-service';

@Injectable()
export class UserLinkService extends SuperService<
  UserLink,
  UserLinkAddDto,
  UserLinkUpdateDto
> {
  constructor(
    @InjectRepository(UserLinkRepository)
    private userLinkRepository: UserLinkRepository
  ) {
    super(UserLink, userLinkRepository);
  }
}
