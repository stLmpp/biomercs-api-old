import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { SuperParamsDto } from '../../shared/super/super-params';

export class TypeAddDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsNumber()
  @IsDefined()
  playerQuantity: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class TypeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  playerQuantity?: number;
}

export class TypeExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  playerQuantity?: number;
}

export class TypeParamsDto extends TypeExistsDto {
  @IsOptional()
  @IsNumber()
  idGame?: number;

  @IsOptional()
  @IsNumber()
  idMode?: number;
}
