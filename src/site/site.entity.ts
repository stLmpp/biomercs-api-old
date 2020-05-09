import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';

@Entity()
export class Site extends CommonColumns {
  @Column() name: string;
  @Column() url: string;
  @Column({ nullable: true }) icon: string;
}
