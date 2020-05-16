import { Injectable } from '@nestjs/common';
import { FileUploadService } from './file-upload/file-upload.service';
import { DefaultsDto } from './app.dto';
import { environment } from './shared/env/env';

@Injectable()
export class AppService {
  constructor(private fileUploadService: FileUploadService) {}

  async defaults(): Promise<DefaultsDto> {
    return new DefaultsDto({
      avatar: await this.fileUploadService.findByOriginalFilename(
        'default-avatar'
      ),
      imageExtensions: environment.config('FILE_IMAGE_EXTENSIONS_ALLOWED'),
    });
  }
}
