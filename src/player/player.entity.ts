import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { User } from '../auth/user/user.entity';
import { SteamProfile } from '../steam/steam-profile.entity';
import { FileUpload } from '../file-upload/file-upload.entity';
import { Region } from '../region/region.entity';
import { PlayerFollower } from './player-follower/player-follower.entity';
import { PlayerLink } from './player-link/player-link.entity';
import { PlayerShowcase } from './player-showcase/player-showcase.entity';

@Entity()
export class Player extends CommonColumns {
  @Column()
  personaName: string;

  @Column({ nullable: true })
  idAvatar: number;

  @OneToOne(() => FileUpload)
  @JoinColumn({ name: 'idAvatar' })
  avatar: FileUpload;

  @Column({ length: 1000, nullable: true })
  aboutMe?: string;

  @Column({ nullable: true, length: 50 })
  title?: string;

  @Column({ nullable: true })
  idRegion?: number;

  @ManyToOne(() => Region)
  @JoinColumn()
  region?: Region;

  @Column({ nullable: true, unique: true })
  idUser: number;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @Column({ nullable: true, unique: true })
  idSteamProfile: number;

  @OneToOne(() => SteamProfile, { nullable: true })
  @JoinColumn()
  steamProfile: SteamProfile;

  @OneToMany(
    () => PlayerFollower,
    playerFollower => playerFollower.followed
  )
  @JoinColumn()
  userFollowers?: PlayerFollower[];

  @OneToMany(
    () => PlayerFollower,
    playerFollower => playerFollower.follower
  )
  @JoinColumn()
  userFollowed?: PlayerFollower[];

  @OneToMany(
    () => PlayerLink,
    playerLink => playerLink.user
  )
  @JoinColumn()
  userLinks: PlayerLink[];

  @OneToOne(
    () => PlayerShowcase,
    playerShowcase => playerShowcase.player
  )
  userShowcase: PlayerShowcase;
}
