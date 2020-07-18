import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { Auth } from '../auth/auth.decorator';
import { UseFileUpload } from '../file-upload/file-upload.decorator';
import { environment } from '../shared/env/env';
import { RouteParamEnum } from '../shared/types/route-enums';
import { FileType } from '../file-upload/file-type.interface';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user/user.entity';
import { FileUpload } from '../file-upload/file-upload.entity';
import { PlayerService } from './player.service';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { PlayerShowcaseUpdateDto } from './player-showcase/player-showcase.dto';
import { PlayerShowcaseService } from './player-showcase/player-showcase.service';
import { PlayerShowcase } from './player-showcase/player-showcase.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Player')
@Roles(RoleEnum.user)
@Auth()
@Controller('player')
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private playerShowcaseService: PlayerShowcaseService
  ) {}

  @UseFileUpload({ filesAllowed: environment.imageExtensionsAllowed })
  @Patch(`:${RouteParamEnum.idPlayer}/avatar`)
  uploadAvatar(
    @Param(RouteParamEnum.idPlayer) idPlayer: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.playerService.uploadAvatar(idPlayer, file, user);
  }

  @Patch(`:${RouteParamEnum.idPlayer}/player-showcase`)
  updateUsershowcase(
    @Param(RouteParamEnum.idPlayer) idPlayer: number,
    @Body(UpdatedByPipe) dto: PlayerShowcaseUpdateDto
  ): Promise<PlayerShowcase> {
    return this.playerShowcaseService.update(idPlayer, dto, 'idPlayer');
  }

  @Get(`:${RouteParamEnum.idPlayer}/player-showcase`)
  findPlayerShowcase(
    @Param(RouteParamEnum.idPlayer) idPlayer: number
  ): Promise<PlayerShowcase> {
    return this.playerShowcaseService.findByPlayer(idPlayer);
  }
}
