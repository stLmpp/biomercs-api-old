import { IsDefined, IsOptional, IsString } from 'class-validator';

export class TypeAddDto {
  @IsString()
  @IsDefined()
  name: string;
}

export class TypeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
}
