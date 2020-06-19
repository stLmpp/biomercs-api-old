import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { Type } from '../game/type/type.entity';
import { ScorePlayer } from './score-player/score-player.entity';
import { GameModePlatform } from '../game/game-mode-platform/game-mode-platform.entity';
import { ScoreApproval } from './score-approval/score-approval.entity';
import { GameModeStage } from '../game/game-mode-stage/game-mode-stage.entity';
import { ScoreStatus } from './score-status/score-status.entity';

@Entity()
export class Score extends CommonColumns {
  static get allRelations(): string[] {
    return [
      'gameModePlatform',
      'gameModePlatform.platform',
      'gameModePlatform.gameMode',
      'gameModePlatform.gameMode.game',
      'gameModePlatform.gameMode.mode',
      'gameModeStage',
      'gameModeStage.stage',
      'type',
      'scorePlayers',
      'scorePlayers.player',
      'scorePlayers.player.region',
      'scorePlayers.character',
      'scorePlayers.scorePlayerProofs',
      'scorePlayers.scorePlayerProofs.site',
      'scoreStatus',
    ];
  }

  @Column()
  idGameModePlatform: number;

  @ManyToOne(() => GameModePlatform)
  @JoinColumn()
  gameModePlatform: GameModePlatform;

  @Column()
  idGameModeStage: number;

  @ManyToOne(() => GameModeStage)
  @JoinColumn()
  gameModeStage: GameModeStage;

  @Column()
  idType: number;

  @ManyToOne(() => Type)
  @JoinColumn()
  type: Type;

  @OneToMany(
    () => ScorePlayer,
    scorePlayer => scorePlayer.score,
    { cascade: true }
  )
  @JoinColumn()
  scorePlayers: ScorePlayer[];

  @Column()
  score: number;

  @Column()
  maxCombo: number;

  @Column({ length: 8 })
  time: string;

  @OneToMany(
    () => ScoreApproval,
    scoreApproval => scoreApproval.score
  )
  @JoinColumn()
  scoreApprovals: ScoreApproval[];

  @Column()
  idScoreStatus: number;

  @ManyToOne(() => ScoreStatus)
  @JoinColumn()
  scoreStatus: ScoreStatus;

  @Column({ nullable: true })
  dateAchieved: Date;
}
