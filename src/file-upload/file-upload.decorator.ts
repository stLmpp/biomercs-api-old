import {
  applyDecorators,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { environment } from '../shared/env/env';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { sha1 } from '../util/hash';
import { v1 } from 'uuid';
import { extname } from 'path';

export interface FileUploadOptions {
  filesAllowed?: string[];
  fieldName?: string;
  multiple?: boolean;
  maxFiles?: number;
  keepFileExtension?: boolean;
  required?: boolean;
}

export function UseFileUpload(
  options: FileUploadOptions = {}
): MethodDecorator {
  options = {
    ...{ fieldName: 'file', maxFiles: 5, keepFileExtension: true },
    ...options,
  };
  const decorators: any[] = [];
  const destination = environment.config('FILE_UPLOAD_PATH');
  const multerOptions: MulterOptions = {
    storage: diskStorage({
      destination,
      filename: (req, file, callback) => {
        const fileNameHash = sha1(file.originalname);
        callback(null, fileNameHash + v1() + extname(file.originalname));
      },
    }),
    dest: destination,
  };
  let filesMessage: string;
  if (options.filesAllowed?.length) {
    filesMessage = `Allowed: [${options.filesAllowed
      .map(o => o?.toUpperCase())
      .join(', ')}]`;
    const regex = new RegExp(`\\.(${options.filesAllowed.join('|')})$`, 'i');
    multerOptions.fileFilter = (req, file, callback) => {
      if (!file.originalname.match(regex)) {
        callback(
          new BadRequestException('File not allowed. ' + filesMessage),
          false
        );
      } else {
        callback(null, true);
      }
    };
  }
  if (options.multiple) {
    decorators.push(
      UseInterceptors(
        FilesInterceptor(options.fieldName, options.maxFiles, multerOptions)
      )
    );
  } else {
    decorators.push(
      UseInterceptors(FileInterceptor(options.fieldName, multerOptions))
    );
  }
  decorators.push(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: 'multipart/form-data',
      description: filesMessage,
      required: true,
      schema: {
        type: 'object',
        properties: {
          [options.fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
  return applyDecorators(...decorators);
}
