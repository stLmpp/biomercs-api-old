import { IsDefined, IsString, MaxLength } from 'class-validator';

export class GameAddDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  @MaxLength(10)
  shortName: string;
}
