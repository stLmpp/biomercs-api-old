import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { Game } from '../game.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { GameModeStage } from '../game-mode-stage/game-mode-stage.entity';

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

  @OneToMany(
    () => GameModeStage,
    gameModeStage => gameModeStage.stage
  )
  @JoinColumn()
  gameModeStages: GameModeStage[];
}
