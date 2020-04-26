import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { FileUploadService } from '../../file-upload/file-upload.service';

@Injectable()
@ValidatorConstraint({ name: 'FileUploadExists', async: true })
export class FileUploadExistsValidator implements ValidatorConstraintInterface {
  constructor(private fileUploadService: FileUploadService) {}

  async validate(
    idFileUpload: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.fileUploadService.exists(idFileUpload);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `File doesn't exist`;
  }
}

export function FileUploadExists(
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'FileUploadExists',
      validator: FileUploadExistsValidator,
      async: true,
    });
  };
}
