import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Player } from '../player.entity';
import { CommonColumns } from '../../shared/super/common-columns';

@Entity()
export class PlayerShowcase extends CommonColumns {
  @Column()
  idPlayer: number;

  @OneToOne(
    () => Player,
    player => player.userShowcase
  )
  @JoinColumn()
  player: Player;

  @Column({ nullable: true })
  idPlatform: number;

  @Column({ nullable: true })
  idGame: number;

  @Column({ nullable: true })
  idMode: number;

  @Column({ nullable: true })
  idType: number;
}
