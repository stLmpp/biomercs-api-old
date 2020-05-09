import { IsDefined, IsNumber } from 'class-validator';
import { GameModeExists } from '../../validation/game/game-mode-exists.validator';
import { CharacterExists } from '../../validation/game/character-exists.validator';

export class GameModeCharacterAddDto {
  @IsNumber()
  @IsDefined()
  @GameModeExists()
  idGameMode: number;

  @IsNumber()
  @IsDefined()
  @CharacterExists()
  idCharacter: number;
}
