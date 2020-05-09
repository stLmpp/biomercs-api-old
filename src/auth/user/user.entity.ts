import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { hash } from 'bcryptjs';
import { CommonColumns } from '../../shared/super/common-columns';
import { UserLink } from './user-link/user-link.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { UserRole } from './user-role/user-role.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class User extends CommonColumns {
  @Column({ unique: true })
  username: string;

  @Column()
  @ApiHideProperty()
  password: string;

  @Column()
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

  token?: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt)) === this.password;
  }

  removePasswordAndSalt(): this {
    this.password = null;
    this.salt = null;
    return this;
  }
}
