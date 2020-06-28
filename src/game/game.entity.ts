import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonColumns } from '../shared/super/common-columns';
import { Stage } from './stage/stage.entity';
import { FileUpload } from '../file-upload/file-upload.entity';
import { GameMode } from './game-mode/game-mode.entity';

@Entity()
export class Game extends CommonColumns {
  @Column()
  name: string;

  @Column({ length: 10 })
  shortName: string;

  @OneToMany(
    () => Stage,
    stage => stage.game
  )
  @JoinColumn()
  stages: Stage[];

  @Column({ nullable: true })
  idLogo: number;

  @OneToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idLogo' })
  logo: FileUpload;

  @OneToMany(
    () => GameMode,
    gameMode => gameMode.game
  )
  @JoinColumn()
  gameModes: GameMode[];

  @Column({ nullable: true })
  order?: number;
}
