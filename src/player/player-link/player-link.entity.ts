import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Player } from '../player.entity';
import { Site } from '../../site/site.entity';
import { CommonColumns } from '../../shared/super/common-columns';

@Entity()
export class PlayerLink extends CommonColumns {
  @Column() url: string;
  @Column() name: string;

  @Column() idPlayer: number;

  @ManyToOne(
    () => Player,
    player => player.userLinks
  )
  @JoinColumn()
  user: Player;

  @Column()
  idSite: number;

  @ManyToOne(() => Site)
  @JoinColumn()
  site: Site;
}
