import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterDto,
  UserRegisterViewModel,
} from './user/dto/register.dto';
import { User } from './user/user.entity';
import { UserCredentialsDto } from './user/dto/credentials.dto';
import { GetUser } from './get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import {
  RouteParamId,
  RouteParamTerm,
  RoutePath,
} from '../shared/types/route-enums';
import { Auth } from './auth.decorator';

export const AuthControllerPath = 'auth';

@Controller(AuthControllerPath)
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    user.token = await this.authService.getToken(user.id, user.rememberMe);
    return user;
  }

  @Get(`${RoutePath.confirmEmail}/:${RouteParamId.idUser}`)
  @Redirect('http://localhost:4200/') // TODO real url
  async confirmEmail(
    @Param(RouteParamId.idUser) idUser: number,
    @Query(RouteParamTerm.emailToken) emailToken: string
  ): Promise<User> {
    return this.authService.confirmEmail(idUser, emailToken);
  }
}
