import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../../shared/super/common-columns';
import { User } from '../user.entity';

@Entity()
export class UserFriend extends CommonColumns {
  @Column()
  idUser: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  idFriend: number;

  @ManyToOne(() => User)
  @JoinColumn()
  friend: User;

  @Column({ nullable: true })
  superFriend?: boolean;
}
