import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { GameMode } from '../game-mode/game-mode.entity';

@Entity({ orderBy: { id: 'ASC' } })
export class Mode extends CommonColumns {
  @Column() name: string;

  @OneToMany(
    () => GameMode,
    gameMode => gameMode.mode
  )
  @JoinColumn()
  gameModes: GameMode[];
}
