import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CommonColumns } from '../../../shared/super/common-columns';
import { User } from '../user.entity';

@Entity()
@Unique(['idFollower', 'idFollowed'])
export class UserFollower extends CommonColumns {
  @Column()
  idFollowed: number;

  @ManyToOne(
    () => User,
    user => user.userFollowed
  )
  @JoinColumn()
  followed: User;

  @Column()
  idFollower: number;

  @ManyToOne(
    () => User,
    user => user.userFollowers
  )
  @JoinColumn()
  follower: User;
}
