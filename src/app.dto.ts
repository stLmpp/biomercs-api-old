import { FileUpload } from './file-upload/file-upload.entity';

export class DefaultsDto {
  constructor(partial?: Partial<DefaultsDto>) {
    Object.assign(this, partial);
  }

  avatar: FileUpload;
  imageExtensions: string[];
}
