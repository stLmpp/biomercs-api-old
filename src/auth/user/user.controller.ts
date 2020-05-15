import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../auth.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from '../../util/types';
import { UserService } from './user.service';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { RouteParamId, RouteParamTerm } from '../../shared/types/route-enums';
import { Roles } from '../role/role.guard';
import { RoleEnum } from '../role/role.enum';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { environment } from '../../shared/env/env';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { GetUser } from '../get-user.decorator';
import { User } from './user.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { UserUpdateDto } from './user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(`:${RouteParamId.idUser}`)
  @Auth()
  @Roles(RoleEnum.user)
  update(
    @Param(RouteParamId.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserUpdateDto
  ): Promise<UpdateResult> {
    return this.userService.update(idUser, dto);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @UseFileUpload({ filesAllowed: environment.imageExtensionsAllowed })
  @Patch(`:${RouteParamId.idUser}/avatar`)
  uploadAvatar(
    @Param(RouteParamId.idUser) idUser: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.userService.uploadAvatar(idUser, file, user);
  }

  @Get('exists/email')
  existsByEmail(@Query(RouteParamTerm.email) email: string): Promise<boolean> {
    return this.userService.existsByEmail(email);
  }

  @Get('exists/username')
  existsByUsername(
    @Query(RouteParamTerm.username) username: string
  ): Promise<boolean> {
    return this.userService.existsByUsername(username);
  }

  @Roles(RoleEnum.admin)
  @Auth()
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'email', required: false })
  @Get('search')
  search(
    @Query(RouteParamTerm.username) username?: string,
    @Query(RouteParamTerm.email) email?: string
  ): Promise<User[]> {
    return this.userService.search(username, email);
  }

  @Get(`:${RouteParamId.idUser}`)
  findById(@Param(RouteParamId.idUser) idUser: number): Promise<User> {
    return this.userService.findById(idUser);
  }
}
