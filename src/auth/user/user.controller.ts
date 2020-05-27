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
import { UserService } from './user.service';
import { UpdatedByPipe } from '../../shared/pipes/updated-by.pipe';
import { RouteParamEnum } from '../../shared/types/route-enums';
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

  @Roles(RoleEnum.user)
  @Auth()
  @Patch(`:${RouteParamEnum.idUser}`)
  update(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserUpdateDto
  ): Promise<User> {
    return this.userService.update(idUser, dto);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @UseFileUpload({ filesAllowed: environment.imageExtensionsAllowed })
  @Patch(`:${RouteParamEnum.idUser}/avatar`)
  uploadAvatar(
    @Param(RouteParamEnum.idUser) idUser: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<FileUpload> {
    return this.userService.uploadAvatar(idUser, file, user);
  }

  @Roles(RoleEnum.admin)
  @Auth()
  @Patch(`:${RouteParamEnum.idUser}/ban`)
  ban(@Param(RouteParamEnum.idUser) idUser: number): Promise<void> {
    return this.userService.ban(idUser);
  }

  @Get('exists/email')
  existsByEmail(@Query(RouteParamEnum.email) email: string): Promise<boolean> {
    return this.userService.existsByEmail(email);
  }

  @Get('exists/username')
  existsByUsername(
    @Query(RouteParamEnum.username) username: string
  ): Promise<boolean> {
    return this.userService.existsByUsername(username);
  }

  @Roles(RoleEnum.admin)
  @Auth()
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'email', required: false })
  @Get('search')
  search(
    @Query(RouteParamEnum.username) username?: string,
    @Query(RouteParamEnum.email) email?: string
  ): Promise<User[]> {
    return this.userService.search(username, email);
  }

  @Get(`:${RouteParamEnum.idUser}`)
  findById(@Param(RouteParamEnum.idUser) idUser: number): Promise<User> {
    return this.userService.findById(idUser);
  }
}
