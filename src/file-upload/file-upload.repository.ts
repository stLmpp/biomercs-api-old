import { EntityRepository, Repository } from 'typeorm';
import { FileUpload } from './file-upload.entity';

@EntityRepository(FileUpload)
export class FileUploadRepository extends Repository<FileUpload> {}
