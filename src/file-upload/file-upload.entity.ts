import { Column, Entity } from 'typeorm';
import { CommonColumns } from '../shared/super-entities/common-columns';

@Entity()
export class FileUpload extends CommonColumns {
  @Column({ length: 1000 }) originalFilename: string;
  @Column({ length: 1000 }) filename: string;
  @Column({ length: 10 }) extension: string;
  @Column() size: number;
  @Column() mimetype: string;
  @Column() destination: string;
  @Column({ length: 1000 }) path: string;
  @Column({ length: 1000 }) url: string;
}
