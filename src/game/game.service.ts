import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameAddDto } from './dto/add.dto';
import { Game } from './game.entity';
import { GameUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../util/types';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository
  ) {}

  async add(dto: GameAddDto): Promise<Game> {
    return await this.gameRepository.save(new Game().extendDto(dto));
  }

  async update(idGame: number, dto: GameUpdateDto): Promise<UpdateResult> {
    return await this.gameRepository.update(idGame, dto);
  }

  async exists(idGame: number): Promise<boolean> {
    return await this.gameRepository.exists({ id: idGame });
  }
}
