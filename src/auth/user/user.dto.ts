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
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;
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
  @IsNumber()
  @MinLength(4)
  password: string;
}
