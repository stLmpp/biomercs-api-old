import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { FileType } from './file-type.interface';

export const imageFileFilter = (
  req: Request,
  file: FileType,
  callback: (error: Error | null, acceptFile: boolean) => void
): void => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false
    );
  }
  callback(null, true);
};
