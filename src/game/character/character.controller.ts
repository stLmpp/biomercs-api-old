import {
  Body,
  Controller,
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
import { CharacterService } from './character.service';
import { CharacterAddDto } from './dto/add.dto';
import { Character } from './character.entity';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { CharacterUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';
import { getImagesAllowed } from '../../util/env';
import { FileUpload } from '../../file-upload/file-upload.entity';

@ApiTags('Character')
@Roles(RoleEnum.admin)
@Auth()
@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: CharacterAddDto): Promise<Character> {
    return this.characterService.add(dto);
  }

  @Patch(`:${RouteParamId.idCharacter}`)
  update(
    @Param(RouteParamId.idCharacter) idCharacter: number,
    @Body(UpdatedByPipe) dto: CharacterUpdateDto
  ): Promise<UpdateResult> {
    return this.characterService.update(idCharacter, dto);
  }

  @Patch(`:${RouteParamId.idCharacter}/image`)
  @UseFileUpload({ filesAllowed: getImagesAllowed() })
  uploadImage(
    @Param(RouteParamId.idCharacter) idCharacter: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.characterService.uploadImage(idCharacter, file, user);
  }

  @Get('params')
  @ApiQuery({ name: 'idGameMode', required: false })
  @ApiQuery({ name: 'idGame', required: false })
  @ApiQuery({ name: 'idMode', required: false })
  findByParams(
    @Query('idGameMode') idGameMode?: number,
    @Query('idGame') idGame?: number,
    @Query('idMode') idMode?: number
  ): Promise<Character[]> {
    return this.characterService.findByParam(idGameMode, idGame, idMode);
  }
}
