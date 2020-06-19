import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';

@Entity()
export class ScoreStatus extends CommonColumns {
  @Column() description: string;
}
