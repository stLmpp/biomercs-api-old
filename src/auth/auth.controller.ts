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
import { RouteParamEnum } from '../shared/types/route-enums';
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
import { UserService } from './user/user.service';

export const AuthControllerPath = 'auth';

@Controller(AuthControllerPath)
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private userService: UserService
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
    const newUser = await this.userService.completeUser(user.id);
    newUser.token = await this.authService.getToken(user);
    newUser.userRoles = user.userRoles;
    return newUser.removePasswordAndSalt();
  }

  @Get(`confirm-email/:${RouteParamEnum.idUser}`)
  @Redirect('http://localhost:4200/') // TODO real url
  async confirmEmail(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Query(RouteParamEnum.emailToken) emailToken: string
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
  @Post(`change-password/:${RouteParamEnum.idUser}`)
  async changePassword(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserChangePasswordDto,
    @GetUser() user: User
  ): Promise<User> {
    if (!this.roleService.isAdmin(user) && user.id !== idUser) {
      throw new UnauthorizedException();
    }
    return this.authService.changePassword(idUser, dto.password);
  }

  @Post(`change-password/:${RouteParamEnum.idUser}/token`)
  async changePasswordToken(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Query(RouteParamEnum.token) token: string,
    @Body() dto: UserChangePasswordDto
  ): Promise<User> {
    await this.authService.confirmForgotPassword(idUser, token);
    return this.authService.changePassword(idUser, dto.password);
  }

  @Roles(RoleEnum.admin)
  @Auth()
  @Post(`reset-password/:${RouteParamEnum.idUser}`)
  async resetPassword(
    @Param(RouteParamEnum.idUser) idUser: number
  ): Promise<void> {
    return this.authService.resetPassword(idUser);
  }
}
