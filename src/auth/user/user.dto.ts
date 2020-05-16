import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegionExists } from '../../validation/region/region-exists.validator';

export class UserCredentialsDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsEmail()
  email: string;
}

export class UserRegisterViewModel {
  message: string;
  email: string;
}

export class UserUpdateDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsNumber()
  @RegionExists()
  idRegion?: number;
}

export class UserForgotPasswordDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserConfirmForgotPasswordDto {
  @IsDefined()
  @IsNumber()
  idUser: number;

  @IsDefined()
  @IsString()
  token: string;
}

export class UserChangePasswordDto {
  @IsDefined()
  @IsString()
  @MinLength(4)
  password: string;
}
