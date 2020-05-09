import { Injectable } from '@nestjs/common';
import { ScorePlayerRepository } from './score-player.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperService } from '../../shared/super/super-service';
import { ScorePlayer } from './score-player.entity';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player.dto';

@Injectable()
export class ScorePlayerService extends SuperService<
  ScorePlayer,
  ScorePlayerAddDto,
  ScorePlayerUpdateDto
> {
  constructor(
    @InjectRepository(ScorePlayerRepository)
    private scorePlayerRepository: ScorePlayerRepository
  ) {
    super(ScorePlayer, scorePlayerRepository);
  }
}
