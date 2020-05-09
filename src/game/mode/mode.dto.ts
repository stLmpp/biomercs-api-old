import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { SuperParamsDto } from '../../shared/super/super-params';

export class ModeAddDto {
  @IsString()
  @IsDefined()
  name: string;
}

export class ModeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class ModeExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class ModeParamsDto extends ModeExistsDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idPlatform?: number;
}
