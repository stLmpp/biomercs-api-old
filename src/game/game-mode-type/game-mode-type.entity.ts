import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { GameMode } from '../game-mode/game-mode.entity';
import { Type } from '../type/type.entity';

@Entity()
export class GameModeType extends CommonColumns {
  @Column()
  idGameMode: number;

  @ManyToOne(
    () => GameMode,
    gameMode => gameMode.gameModeTypes
  )
  @JoinColumn()
  gameMode: GameMode;

  @Column()
  idType: number;

  @ManyToOne(
    () => Type,
    type => type.gameModeTypes
  )
  type: Type;
}
