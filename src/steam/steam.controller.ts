import { Controller, Get, Param, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SteamService } from './steam.service';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user/user.entity';
import { RouteParamEnum } from '../shared/types/route-enums';
import { SteamProfile } from './steam-profile.entity';

@ApiTags('Steam')
@Controller('steam')
export class SteamController {
  constructor(private steamService: SteamService) {}

  @Roles(RoleEnum.user)
  @Auth()
  @Get('login')
  async login(@GetUser() user: User): Promise<string> {
    return await this.steamService.openIdUrl(user);
  }

  @Get('auth')
  async auth(
    @Req() req: Request,
    @Res() res: Response,
    @Query(RouteParamEnum.idUser) idUser: number
  ): Promise<void> {
    await this.steamService.authenticate(req, idUser);
    res.redirect(`http://localhost:4200/user/${idUser}/profile`);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @Put(`:${RouteParamEnum.idSteamProfile}/refresh`)
  async refresh(
    @Param(RouteParamEnum.idSteamProfile) idSteamProfile: number
  ): Promise<SteamProfile> {
    return this.steamService.updateSteamProfile(idSteamProfile);
  }
}
