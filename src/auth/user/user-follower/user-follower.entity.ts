import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../../shared/super/common-columns';
import { User } from '../user.entity';

@Entity()
export class UserFollower extends CommonColumns {
  @Column()
  idUser: number;

  @ManyToOne(
    () => User,
    user => user.userFollowers
  )
  @JoinColumn()
  user: User;

  @Column()
  idFollower: number;

  @ManyToOne(() => User)
  @JoinColumn()
  follower: User;
}
