import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';

@Entity()
export class Mode extends CommonColumns {
  @Column() name: string;
}
