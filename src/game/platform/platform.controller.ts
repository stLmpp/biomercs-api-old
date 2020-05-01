import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { PlatformAddDto } from './dto/add.dto';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { RouteParamId } from '../../shared/types/route-enums';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { PlatformUpdateDto } from './dto/update.dto';
import { Platform } from './platform.entity';
import { UpdateResult } from '../../util/types';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { getImagesAllowed } from '../../util/env';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';

@ApiTags('Platform')
@Roles(RoleEnum.admin)
@Auth()
@Controller('platform')
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: PlatformAddDto): Promise<Platform> {
    return this.platformService.add(dto);
  }

  @Patch(`:${RouteParamId.idPlatform}`)
  update(
    @Param(RouteParamId.idPlatform) idPlatform: number,
    @Body(UpdatedByPipe) dto: PlatformUpdateDto
  ): Promise<UpdateResult> {
    return this.platformService.update(idPlatform, dto);
  }

  @Patch(`:${RouteParamId.idPlatform}/logo`)
  @UseFileUpload({ filesAllowed: getImagesAllowed() })
  uploadLogo(
    @Param(RouteParamId.idPlatform) idPlatform: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.platformService.uploadLogo(idPlatform, file, user);
  }
}
