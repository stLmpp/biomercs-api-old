import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { RouteParamId } from '../shared/types/route-enums';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { UpdateResult } from '../util/types';
import { Game } from './game.entity';
import { GameUpdateDto } from './dto/update.dto';
import { GameAddDto } from './dto/add.dto';
import { UseFileUpload } from '../file-upload/file-upload.decorator';
import { getImagesAllowed } from '../util/env';
import { FileUpload } from '../file-upload/file-upload.entity';
import { FileType } from '../file-upload/file-type.interface';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user/user.entity';

@ApiTags('Game')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: GameAddDto): Promise<Game> {
    return this.gameService.add(dto);
  }

  @Patch(`:${RouteParamId.idGame}`)
  update(
    @Param(RouteParamId.idGame) idGame: number,
    @Body(UpdatedByPipe) dto: GameUpdateDto
  ): Promise<UpdateResult> {
    return this.gameService.update(idGame, dto);
  }

  @Patch(`:${RouteParamId.idGame}/logo`)
  @UseFileUpload({ filesAllowed: getImagesAllowed() })
  uploadLogo(
    @Param(RouteParamId.idGame) idGame: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.gameService.uploadLogo(idGame, file, user);
  }

  @Get()
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }
}
