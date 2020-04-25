import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../../shared/super-entities/common-columns';
import { User } from '../user.entity';
import { Role } from '../../role/role.entity';

@Entity()
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
