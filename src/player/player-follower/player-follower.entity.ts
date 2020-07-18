import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { Player } from '../player.entity';

@Entity()
@Unique(['idFollower', 'idFollowed'])
export class PlayerFollower extends CommonColumns {
  @Column()
  idFollowed: number;

  @ManyToOne(
    () => Player,
    player => player.userFollowed
  )
  @JoinColumn()
  followed: Player;

  @Column()
  idFollower: number;

  @ManyToOne(
    () => Player,
    player => player.userFollowers
  )
  @JoinColumn()
  follower: Player;
}
