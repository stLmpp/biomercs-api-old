import { Injectable } from '@nestjs/common';
import { ScorePlayerRepository } from './score-player.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScorePlayerService {
  constructor(
    @InjectRepository(ScorePlayerRepository)
    private scorePlayerRepository: ScorePlayerRepository
  ) {}

  async exists(idScorePlayer: number): Promise<boolean> {
    return await this.scorePlayerRepository.exists({ id: idScorePlayer });
  }
}
