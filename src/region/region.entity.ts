import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';

@Entity()
export class Region extends CommonColumns {
  @Column()
  name: string;

  @Column({ length: 10 })
  shortName: string;
}
