import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerLinkRepository } from './player-link.repository';
import { PlayerLinkAddDto, PlayerLinkUpdateDto } from './player-link.dto';
import { PlayerLink } from './player-link.entity';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class PlayerLinkService extends SuperService<
  PlayerLink,
  PlayerLinkAddDto,
  PlayerLinkUpdateDto
> {
  constructor(
    @InjectRepository(PlayerLinkRepository)
    private playerLinkRepository: PlayerLinkRepository
  ) {
    super(PlayerLink, playerLinkRepository);
  }
}
