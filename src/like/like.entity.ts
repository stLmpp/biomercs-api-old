import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { LikeStyleEnum } from './like-style.enum';
import { ReferenceTypeEnum } from '../shared/types/reference-type.enum';

@Entity()
export class Like extends CommonColumns {
  @Column({ type: 'enum', enum: ReferenceTypeEnum })
  type: ReferenceTypeEnum;

  @Column({ type: 'enum', enum: LikeStyleEnum })
  style: LikeStyleEnum;

  @Column()
  idReference: number;
}
