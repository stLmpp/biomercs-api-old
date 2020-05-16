import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { allColumns, CommonColumns } from '../../shared/super/common-columns';
import { UserLink } from './user-link/user-link.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { UserRole } from './user-role/user-role.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { Region } from '../../region/region.entity';

@Entity()
export class User extends CommonColumns {
  static get all(): (keyof User)[] {
    return allColumns<User>(User, ['resetToken', 'emailToken']);
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

  @OneToMany(
    () => UserLink,
    userLink => userLink.user
  )
  @JoinColumn()
  userLinks: UserLink[];

  @Column({ select: false, nullable: true })
  emailToken?: string;

  @Column({ nullable: true })
  rememberMe?: boolean;

  @OneToMany(
    () => UserRole,
    userRole => userRole.user
  )
  @JoinColumn()
  userRoles: UserRole[];

  @Column({ nullable: true })
  idAvatar: number;

  @OneToOne(() => FileUpload)
  @JoinColumn({ name: 'idAvatar' })
  avatar: FileUpload;

  @Column({ select: false, nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  expired?: boolean;

  @DeleteDateColumn({ nullable: true })
  banDate?: Date;

  @Column({ length: 1000, nullable: true })
  aboutMe?: string;

  @Column({ nullable: true, length: 50 })
  title?: string;

  @Column({ nullable: true })
  idRegion?: number;

  @ManyToOne(() => Region)
  @JoinColumn()
  region?: Region;

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
