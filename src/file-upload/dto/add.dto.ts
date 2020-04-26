import { IsDefined, IsString } from 'class-validator';

export class FileUploadAddDto {
  @IsString()
  @IsDefined()
  originalFilename: string;

  @IsString()
  @IsDefined()
  filename: string;

  @IsString()
  @IsDefined()
  size: number;

  @IsString()
  @IsDefined()
  mimetype: string;

  @IsString()
  @IsDefined()
  destination: string;

  @IsString()
  @IsDefined()
  path: string;
}
