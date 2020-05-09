import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { GameMode } from '../game-mode/game-mode.entity';
import { Character } from '../character/character.entity';

@Entity()
export class GameModeCharacter extends CommonColumns {
  @Column()
  idGameMode: number;

  @ManyToOne(
    () => GameMode,
    gameMode => gameMode.gameModeCharacters
  )
  @JoinColumn()
  gameMode: GameMode;

  @Column()
  idCharacter: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character: Character;
}
