import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { User } from '../auth/user/user.entity';
import { LikeStyleEnum } from './like-style.enum';
import { Score } from '../score/score.entity';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';

@Entity()
export class Like extends CommonColumns {
  @Column({ type: 'enum', enum: ReferenceTypeEnum })
  type: ReferenceTypeEnum;

  @Column({ type: 'enum', enum: LikeStyleEnum })
  style: LikeStyleEnum;

  @Column()
  idReference: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'idReference', referencedColumnName: 'id' })
  userLiked?: User;

  @ManyToOne(() => Score, { nullable: true })
  @JoinColumn({ name: 'idReference', referencedColumnName: 'id' })
  scoreLiked?: Score;
}
