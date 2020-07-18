import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { Score } from '../score.entity';
import { Character } from '../../game/character/character.entity';
import { ScorePlayerProof } from '../score-player-proof/score-player-proof.entity';
import { Player } from '../../player/player.entity';

@Entity()
export class ScorePlayer extends CommonColumns {
  @Column()
  idScore: number;

  @ManyToOne(
    () => Score,
    score => score.scorePlayers
  )
  @JoinColumn()
  score: Score;

  @Column()
  idPlayer: number;

  @ManyToOne(() => Player)
  @JoinColumn()
  player: Player;

  @Column()
  idCharacter: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character: Character;

  @Column({ default: false })
  host: boolean;

  @Column({ nullable: true })
  bulletKills: number;

  @OneToMany(
    () => ScorePlayerProof,
    scorePlayerProof => scorePlayerProof.scorePlayer
  )
  @JoinColumn()
  scorePlayerProofs: ScorePlayerProof[];

  @Column({ length: 1000, nullable: true })
  description?: string;
}
