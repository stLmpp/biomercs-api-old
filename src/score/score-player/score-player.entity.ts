import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';
import { Score } from '../score.entity';
import { User } from '../../auth/user/user.entity';
import { Character } from '../../game/character/character.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'idPlayer' })
  player: User;

  @Column()
  idCharacter: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character: Character;

  @Column({ default: false })
  host: boolean;

  @Column({ default: 0 })
  bulletKills: number;
}
