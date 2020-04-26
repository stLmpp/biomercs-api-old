import { EntityRepository } from 'typeorm';
import { FileUpload } from './file-upload.entity';
import { CustomRepository } from '../shared/types/custom-repository';

@EntityRepository(FileUpload)
export class FileUploadRepository extends CustomRepository<FileUpload> {}
