import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonColumns } from '../shared/super-entities/common-columns';
import { Type } from '../game/type/type.entity';
import { ScorePlayer } from './score-player/score-player.entity';
import { Stage } from '../game/stage/stage.entity';
import { GameModePlatform } from '../game/game-mode-platform/game-mode-platform.entity';

@Entity()
export class Score extends CommonColumns {
  @Column()
  idGameModePlatform: number;

  @ManyToOne(() => GameModePlatform)
  @JoinColumn()
  gameModePlatform: GameModePlatform;

  @Column()
  idStage: number;

  @ManyToOne(() => Stage)
  @JoinColumn()
  stage: Stage;

  @Column()
  idType: number;

  @ManyToOne(() => Type)
  @JoinColumn()
  type: Type;

  @OneToMany(
    () => ScorePlayer,
    scorePlayer => scorePlayer.score
  )
  @JoinColumn()
  scorePlayers: ScorePlayer[];

  @Column()
  score: number;

  @Column()
  maxCombo: number;

  @Column({ length: 8, nullable: true })
  time: string;

  @Column({ length: 1000, nullable: true })
  description?: string;
}
