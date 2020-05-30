import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { ScorePlayer } from '../score-player/score-player.entity';
import { Site } from '../../site/site.entity';

@Entity()
export class ScorePlayerProof extends CommonColumns {
  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  idSite: number;

  @ManyToOne(() => Site, { nullable: true })
  @JoinColumn()
  site: Site;

  @Column({ nullable: true })
  idImage: number;

  @OneToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;

  @Column()
  idScorePlayer: number;

  @ManyToOne(
    () => ScorePlayer,
    scorePlayer => scorePlayer.scorePlayerProofs
  )
  @JoinColumn()
  scorePlayer: ScorePlayer;
}
