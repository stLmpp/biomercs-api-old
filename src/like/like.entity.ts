import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../shared/super-entities/common-columns';
import { LikeTypeEnum } from './like-type.enum';
import { User } from '../auth/user/user.entity';
import { LikeStyleEnum } from './like-style.enum';

@Entity()
export class Like extends CommonColumns {
  @Column({ type: 'enum', enum: LikeTypeEnum })
  type: LikeTypeEnum;

  @Column({ type: 'enum', enum: LikeStyleEnum })
  style: LikeStyleEnum;

  @Column()
  idUser: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  idReference: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'idReference', referencedColumnName: 'id' })
  userLiked: User;
}
