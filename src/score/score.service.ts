import { Injectable } from '@nestjs/common';
import { Score } from './score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreRepository) private scoreRepository: ScoreRepository
  ) {}

  async getTopScore(
    idGame: number,
    idMode: number,
    idType: number,
    idPlatform: number,
    idCharacter: number
  ): Promise<Score> {
    return await this.scoreRepository.getTopScore(
      idGame,
      idMode,
      idType,
      idPlatform,
      idCharacter
    );
  }

  async exists(idScore: number): Promise<boolean> {
    return await this.scoreRepository.exists({ id: idScore });
  }
}
