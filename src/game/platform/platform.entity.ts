import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';
import { PlatformTypeEnum } from './platform-type.enum';
import { GameModePlatform } from '../game-mode-platform/game-mode-platform.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class Platform extends CommonColumns {
  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column({ type: 'enum', enum: PlatformTypeEnum })
  type: PlatformTypeEnum;

  @OneToMany(
    () => GameModePlatform,
    gameModePlatform => gameModePlatform.platform
  )
  @JoinColumn()
  gameModePlatform: GameModePlatform[];

  @Column()
  idLogo: number;

  @OneToOne(() => FileUpload)
  @JoinColumn({ name: 'idLogo' })
  logo: FileUpload;
}
