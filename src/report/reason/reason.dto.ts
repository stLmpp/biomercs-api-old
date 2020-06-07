import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ReasonAddDto {
  @IsString()
  @IsDefined()
  description: string;
}

export class ReasonUpdateDto {
  @IsString()
  @IsOptional()
  description?: string;
}
