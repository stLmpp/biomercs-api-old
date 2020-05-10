import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { Game } from '../game.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class Stage extends CommonColumns {
  @Column()
  name: string;

  @Column({ length: 10 })
  shortName: string;

  @Column()
  idGame: number;

  @ManyToOne(
    () => Game,
    game => game.stages
  )
  @JoinColumn()
  game: Game;

  @Column({ nullable: true, default: false })
  custom: boolean;

  @Column({ nullable: true })
  customUrl: string;

  @Column({ nullable: true })
  idImage: number;

  @ManyToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;
}
