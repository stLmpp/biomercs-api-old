import { IsEmail, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @IsEmail()
  @IsOptional()
  email?: string;
}
