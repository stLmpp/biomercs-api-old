import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super-entities/common-columns';
import { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class Character extends CommonColumns {
  @Column()
  name: string;

  @Column({ length: 15 })
  shortName: string;

  @Column({ nullable: true })
  idImage: number;

  @ManyToOne(() => FileUpload, { nullable: true })
  @JoinColumn({ name: 'idImage' })
  image: FileUpload;
}
