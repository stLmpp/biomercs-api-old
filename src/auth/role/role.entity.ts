import { CommonColumns } from '../../shared/super-entities/common-columns';
import { Column, Entity } from 'typeorm';
import { RoleEnum } from './role.enum';

@Entity()
export class Role extends CommonColumns {
  @Column({ unique: true, type: 'enum', enum: RoleEnum })
  name: RoleEnum;

  @Column({ nullable: true })
  description: string;
}
