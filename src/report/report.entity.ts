import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../shared/super-entities/common-columns';
import { User } from '../auth/user/user.entity';
import { Score } from '../score/score.entity';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';

@Entity()
export class Report extends CommonColumns {
  @Column({ type: 'enum', enum: ReferenceTypeEnum })
  type: ReferenceTypeEnum;

  @Column()
  idReference: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'idReference' })
  userReported?: User;

  @ManyToOne(() => Score, { nullable: true })
  @JoinColumn({ name: 'idReference' })
  scoreReported?: Score;
}
