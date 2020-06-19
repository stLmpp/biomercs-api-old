import { Injectable } from '@nestjs/common';
import { ScoreStatusRepository } from './score-status.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreStatus } from './score-status.entity';

@Injectable()
export class ScoreStatusService {
  constructor(
    @InjectRepository(ScoreStatusRepository)
    private scoreStatusRepository: ScoreStatusRepository
  ) {
    this.setScoreStatus().then();
  }

  private async setScoreStatus(): Promise<void> {
    const exists = await this.scoreStatusRepository.exists();
    if (!exists) {
      if (!exists) {
        const scoreStatus = (await import('./score-status.json')) as Partial<
          ScoreStatus
        >[];
        await this.scoreStatusRepository.save(scoreStatus);
      }
    }
  }
}
