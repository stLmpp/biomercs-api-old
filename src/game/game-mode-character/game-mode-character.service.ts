import { Injectable } from '@nestjs/common';
import { GameModeCharacterRepository } from './game-mode-character.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameModeCharacterAddDto } from './dto/add.dto';
import { GameModeCharacter } from './game-mode-character.entity';
import { DeleteResult } from '../../util/types';

@Injectable()
export class GameModeCharacterService {
  constructor(
    @InjectRepository(GameModeCharacterRepository)
    private gameModeCharacterRepository: GameModeCharacterRepository
  ) {}

  async add(dto: GameModeCharacterAddDto): Promise<GameModeCharacter> {
    return await this.gameModeCharacterRepository.save(
      new GameModeCharacter().extendDto(dto)
    );
  }

  async delete(idGameModeCharacter: number): Promise<DeleteResult> {
    return await this.gameModeCharacterRepository.delete(idGameModeCharacter);
  }

  async exists(idGameModeCharacter: number): Promise<boolean> {
    return await this.gameModeCharacterRepository.exists({
      id: idGameModeCharacter,
    });
  }

  async replicateToGameMode(
    idGameModeOrigin: number
  ): Promise<GameModeCharacter[]> {
    const originGameModeCharacters = await this.gameModeCharacterRepository.find(
      { where: { idGameMode: idGameModeOrigin } }
    );
    return [];
  }
}
