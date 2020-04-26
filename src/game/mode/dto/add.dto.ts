import { IsDefined, IsString } from 'class-validator';

export class ModeAddDto {
  @IsString()
  @IsDefined()
  name: string;
}
