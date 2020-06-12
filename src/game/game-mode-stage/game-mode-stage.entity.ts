import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { GameMode } from '../game-mode/game-mode.entity';
import { Stage } from '../stage/stage.entity';

@Entity()
export class GameModeStage extends CommonColumns {
  @Column()
  idGameMode: number;

  @ManyToOne(() => GameMode)
  @JoinColumn()
  gameMode: GameMode;

  @Column()
  idStage: number;

  @ManyToOne(
    () => Stage,
    stage => stage.gameModeStages
  )
  @JoinColumn()
  stage: Stage;

  @Column({ default: 0 })
  maxEnemies: number;

  @Column({ default: 0 })
  maxCombo: number;
}
