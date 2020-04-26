import { IsEnum, IsOptional } from 'class-validator';
import { LikeStyleEnum } from '../like-style.enum';

export class LikeUpdateDto {
  @IsOptional()
  @IsEnum(LikeStyleEnum)
  style?: LikeStyleEnum;
}
