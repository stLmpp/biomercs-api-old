import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SuperParamsDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  id?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  createdBy?: number;
}
