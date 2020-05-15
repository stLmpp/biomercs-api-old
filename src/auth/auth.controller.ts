import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user/user.entity';
import { GetUser } from './get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import {
  RouteParamId,
  RouteParamTerm,
  RoutePath,
} from '../shared/types/route-enums';
import { Auth } from './auth.decorator';
import {
  UserChangePasswordDto,
  UserConfirmForgotPasswordDto,
  UserCredentialsDto,
  UserForgotPasswordDto,
  UserRegisterDto,
  UserRegisterViewModel,
} from './user/user.dto';
import { Roles } from './role/role.guard';
import { RoleEnum } from './role/role.enum';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { RoleService } from './role/role.service';

export const AuthControllerPath = 'auth';

@Controller(AuthControllerPath)
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  @Post('register')
  async register(
    @Body(CreatedByPipe) dto: UserRegisterDto
  ): Promise<UserRegisterViewModel> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: UserCredentialsDto): Promise<User> {
    return this.authService.login(dto);
  }

  @Post('auto-login')
  @Auth()
  async autoLogin(@GetUser() user: User): Promise<User> {
    if (user.id === -1) {
      return null;
    }
    user.token = await this.authService.getToken(user);
    return user.removePasswordAndSalt();
  }

  @Get(`${RoutePath.confirmEmail}/:${RouteParamId.idUser}`)
  @Redirect('http://localhost:4200/') // TODO real url
  async confirmEmail(
    @Param(RouteParamId.idUser) idUser: number,
    @Query(RouteParamTerm.emailToken) emailToken: string
  ): Promise<User> {
    return this.authService.confirmEmail(idUser, emailToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: UserForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('confirm-forgot-password')
  @HttpCode(200)
  async confirmForgotPassword(
    @Body() dto: UserConfirmForgotPasswordDto
  ): Promise<boolean> {
    return this.authService.confirmForgotPassword(dto.idUser, dto.token);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @Post(`change-password/:${RouteParamId.idUser}`)
  async changePassword(
    @Param(RouteParamId.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserChangePasswordDto,
    @GetUser() user: User
  ): Promise<boolean> {
    if (!this.roleService.isAdmin(user) && user.id !== idUser) {
      throw new UnauthorizedException();
    }
    return this.authService.changePassword(idUser, dto.password);
  }

  @Post(`change-password/:${RouteParamId.idUser}/token`)
  async changePasswordToken(
    @Param(RouteParamId.idUser) idUser: number,
    @Query(RouteParamTerm.token) token: string,
    @Body() dto: UserChangePasswordDto
  ): Promise<boolean> {
    await this.authService.confirmForgotPassword(idUser, token);
    return this.authService.changePassword(idUser, dto.password);
  }
}
