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
}

export class UserForgotPasswordDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserConfirmDto {
  @IsDefined()
  @IsNumber()
  idUser: number;

  @IsDefined()
  @IsNumber()
  code: number;
}

export class UserChangePasswordDto {
  @IsDefined()
  @IsString()
  @MinLength(4)
  password: string;

  @IsDefined()
  @IsNumber()
  code: number;
}
