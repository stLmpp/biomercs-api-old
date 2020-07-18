import {
  Body,
  Controller,
  Param,
  Post,
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

  @Post(`confirm-email/:${RouteParamEnum.code}`)
  async confirmEmail(@Param(RouteParamEnum.code) code: number): Promise<User> {
    return this.authService.confirmEmail(code);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: UserForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post(`confirm-forgot-password/:${RouteParamEnum.code}`)
  async confirmForgotPassword(
    @Param(RouteParamEnum.code) code: number
  ): Promise<boolean> {
    return this.authService.confirmForgotPassword(code);
  }

  @Post(`change-password/code`)
  async changePasswordCode(
    @Body(UpdatedByPipe) dto: UserChangePasswordDto
  ): Promise<User> {
    const user = await this.authService.findUserByCode(dto.code);
    return this.authService.changePassword(user.id, dto.password);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @Post(`change-password/:${RouteParamEnum.idUser}`)
  async changePassword(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserChangePasswordDto,
    @GetUser() user: User
  ): Promise<User> {
    if (!this.roleService.isAdmin(user) || user.id !== idUser) {
      throw new UnauthorizedException();
    }
    return this.authService.changePassword(idUser, dto.password);
  }

  @Roles(RoleEnum.owner)
  @Auth()
  @Post(`reset-password/:${RouteParamEnum.idUser}`)
  async resetPassword(
    @Param(RouteParamEnum.idUser) idUser: number
  ): Promise<void> {
    return this.authService.resetPassword(idUser);
  }
}
