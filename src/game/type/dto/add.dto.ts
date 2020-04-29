import { IsDefined, IsString } from 'class-validator';

export class TypeAddDto {
  @IsString()
  @IsDefined()
  name: string;
}
