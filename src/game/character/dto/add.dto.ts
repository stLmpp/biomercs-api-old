import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CharacterAddDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  @MaxLength(15)
  shortName: string;
}
