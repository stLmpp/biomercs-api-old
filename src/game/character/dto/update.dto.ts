import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileUploadExists } from '../../../validation/file-upload/file-upload-exists.validator';

export class CharacterUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  shortName?: string;

  @IsOptional()
  @IsNumber()
  @FileUploadExists()
  idImage?: number;
}
