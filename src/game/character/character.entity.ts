import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { GameModeCharacter } from '../game-mode-character/game-mode-character.entity';

@Entity()
export class Character extends CommonColumns {
  @Column()
  name: string;

  @Column({ length: 15 })
  shortName: string;

  @Column({ nullable: true })
  idImage: number;

  @OneToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;

  @OneToMany(
    () => GameModeCharacter,
    gameModeCharacter => gameModeCharacter.character
  )
  @JoinColumn()
  gameModeCharacters: GameModeCharacter[];
}
