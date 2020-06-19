import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonColumns } from '../../../shared/super/common-columns';
import { User } from '../user.entity';

@Entity()
export class UserShowcase extends CommonColumns {
  @Column({ nullable: true })
  idUser: number;

  @OneToOne(
    () => User,
    user => user.userShowcase,
    { nullable: true }
  )
  @JoinColumn({ name: 'idUser', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: true })
  idPlatform: number;

  @Column({ nullable: true })
  idGame: number;

  @Column({ nullable: true })
  idMode: number;

  @Column({ nullable: true })
  idType: number;
}
