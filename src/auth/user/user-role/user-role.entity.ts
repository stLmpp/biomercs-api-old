import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CommonColumns } from '../../../shared/super/common-columns';
import { User } from '../user.entity';
import { Role } from '../../role/role.entity';

@Entity()
@Unique(['idUser', 'idRole'])
export class UserRole extends CommonColumns {
  @Column()
  idUser: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  idRole: number;

  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;
}
