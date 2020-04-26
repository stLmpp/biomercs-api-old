import { IsDefined, IsNumber } from 'class-validator';
import { CharacterExists } from '../../../validation/game/character-exists.validator';
import { GameModeExists } from '../../../validation/game/game-mode-exists.validator';

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
