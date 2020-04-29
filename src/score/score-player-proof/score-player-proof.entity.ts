import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { ScorePlayer } from '../score-player/score-player.entity';

@Entity()
export class ScorePlayerProof extends CommonColumns {
  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  idImage: number;

  @OneToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;

  @ManyToOne(() => ScorePlayer)
  @JoinColumn()
  scorePlayer: ScorePlayer;
}
