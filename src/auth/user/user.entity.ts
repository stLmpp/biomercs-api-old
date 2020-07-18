import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { hash } from 'bcryptjs';
import { allColumns, CommonColumns } from '../../shared/super/common-columns';
import { ApiHideProperty } from '@nestjs/swagger';
import { UserRole } from './user-role/user-role.entity';
import { Player } from '../../player/player.entity';

@Entity()
export class User extends CommonColumns {
  static get all(): (keyof User)[] {
    return allColumns(User);
  }

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  @ApiHideProperty()
  password: string;

  @Column({ select: false })
  @ApiHideProperty()
  salt: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  lastOnline?: Date;

  @Column({ nullable: true })
  rememberMe?: boolean;

  @OneToMany(
    () => UserRole,
    userRole => userRole.user
  )
  @JoinColumn()
  userRoles: UserRole[];

  @Column({ nullable: true })
  expired?: boolean;

  @Column({ nullable: true })
  banDate?: Date;

  @OneToOne(
    () => Player,
    player => player.user
  )
  player: Player;

  @Column({ nullable: true, unique: true })
  confirmationCode?: number;

  token?: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt)) === this.password;
  }

  removePasswordAndSalt(): this {
    if (this.hasOwnProperty('password')) {
      delete this.password;
    }
    if (this.hasOwnProperty('salt')) {
      delete this.salt;
    }
    return this;
  }
}
