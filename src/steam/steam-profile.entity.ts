import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';

@Entity()
export class SteamProfile extends CommonColumns {
  @Column({ unique: true })
  steamid: string;

  @Column()
  communityvisibilitystate: number;

  @Column()
  profilestate: number;

  @Column()
  personaname: string;

  @Column()
  profileurl: string;

  @Column()
  avatar: string;

  @Column()
  avatarmedium: string;

  @Column()
  avatarfull: string;

  @Column()
  avatarhash: string;

  @Column()
  lastlogoff: number;

  @Column()
  personastate: number;

  @Column()
  realname: string;

  @Column()
  primaryclanid: string;

  @Column()
  timecreated: number;

  @Column()
  personastateflags: number;
}
