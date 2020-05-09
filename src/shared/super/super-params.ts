import { IsNumber, IsOptional } from 'class-validator';

export class SuperParamsDto {
  @IsOptional()
  @IsNumber()
  id?: number;
}
