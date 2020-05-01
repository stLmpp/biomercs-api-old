import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super-entities/common-columns';

@Entity()
export class Site extends CommonColumns {
  @Column() name: string;
  @Column() url: string;
  @Column({ nullable: true }) icon: string;
}
