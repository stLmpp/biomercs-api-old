import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';
import { Game } from '../game.entity';
import { Mode } from '../mode/mode.entity';
import { GameModeCharacter } from '../game-mode-character/game-mode-character.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class GameMode extends CommonColumns {
  @Column()
  idGame: number;

  @ManyToOne(
    () => Game,
    game => game.gameModes
  )
  @JoinColumn()
  game: Game;

  @Column()
  idMode: number;

  @ManyToOne(() => Mode)
  @JoinColumn()
  mode: Mode;

  @OneToMany(
    () => GameModeCharacter,
    gameModeCharacter => gameModeCharacter.gameMode
  )
  @JoinColumn()
  gameModeCharacters: GameModeCharacter[];

  @Column({ nullable: true })
  idImage: number;

  @ManyToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;
}
