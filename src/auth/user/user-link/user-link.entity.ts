import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../../shared/super-entities/common-columns';
import { User } from '../user.entity';
import { Site } from '../../../site/site.entity';

@Entity()
export class UserLink extends CommonColumns {
  @Column() url: string;
  @Column() name: string;

  @Column() idUser: number;

  @ManyToOne(
    () => User,
    user => user.userLinks
  )
  @JoinColumn()
  user: User;

  @Column()
  idSite: number;

  @ManyToOne(() => Site)
  @JoinColumn()
  site: Site;
}
