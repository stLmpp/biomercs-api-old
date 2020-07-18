import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { SuperParamsDto } from '../../shared/super/super-params';

export class PlayerFollowerAddDto {
  @IsDefined()
  @IsNumber()
  idFollower: number;

  @IsDefined()
  @IsNumber()
  idFollowed: number;
}

export class PlayerFollowerExistsDto extends SuperParamsDto {
  @IsOptional()
  @IsNumber()
  idFollower?: number;

  @IsOptional()
  @IsNumber()
  idFollowed?: number;
}

export class PlayerFollowerDeleteDto {
  @IsDefined()
  @IsNumber()
  idFollower: number;

  @IsDefined()
  @IsNumber()
  idFollowed: number;
}
