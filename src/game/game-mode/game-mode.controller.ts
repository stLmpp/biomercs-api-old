import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GameModeService } from './game-mode.service';
import { GameModeAddDto } from './dto/add.dto';
import { GameMode } from './game-mode.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { DeleteResult } from '../../util/types';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { getImagesAllowed } from '../../util/env';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';

@ApiTags('Game mode')
@Roles(RoleEnum.admin)
@Auth()
@Controller('game-mode')
export class GameModeController {
  constructor(private gameModeService: GameModeService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: GameModeAddDto): Promise<GameMode> {
    return this.gameModeService.add(dto);
  }

  @Delete(`:${RouteParamId.idGameMode}`)
  delete(
    @Param(RouteParamId.idGameMode) idGameMode: number
  ): Promise<DeleteResult> {
    return this.gameModeService.delete(idGameMode);
  }

  @Patch(`:${RouteParamId.idGameMode}/image`)
  @UseFileUpload({ filesAllowed: getImagesAllowed() })
  uploadImage(
    @Param(RouteParamId.idGameMode) idGameMode: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.gameModeService.uploadImage(idGameMode, file, user);
  }

  @Get()
  @ApiQuery({ name: RouteParamId.idGame, required: false })
  @ApiQuery({ name: RouteParamId.idMode, required: false })
  findByParams(
    @Query(RouteParamId.idGame) idGame?: number,
    @Query(RouteParamId.idMode) idMode?: number
  ): Promise<GameMode[]> {
    return this.gameModeService.findByParams(idGame, idMode);
  }
}
