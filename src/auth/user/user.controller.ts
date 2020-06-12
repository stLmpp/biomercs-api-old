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
import { UserShowcase } from './user-showcase/user-showcase.entity';
import { UserShowcaseUpdateDto } from './user-showcase/user-showcase.dto';
import { UserShowcaseService } from './user-showcase/user-showcase.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userShowcaseService: UserShowcaseService
  ) {}

  @Roles(RoleEnum.user)
  @Auth()
  @Patch(`${RouteParamEnum.idUser}/user-showcase`)
  updateUsershowcase(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Body(UpdatedByPipe) dto: UserShowcaseUpdateDto
  ): Promise<UserShowcase> {
    return this.userShowcaseService.update(idUser, dto, 'idUser');
  }

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

  @ApiQuery({ name: RouteParamEnum.idUser, required: false })
  @Get('exists/email')
  existsByEmail(
    @Query(RouteParamEnum.email) email: string,
    @Query(RouteParamEnum.idUser) idUser?: number
  ): Promise<boolean> {
    return this.userService.existsByEmail(email, idUser);
  }

  @Get('exists/username')
  existsByUsername(
    @Query(RouteParamEnum.username) username: string
  ): Promise<boolean> {
    return this.userService.existsByUsername(username);
  }

  @Roles(RoleEnum.user)
  @Auth()
  @ApiQuery({ name: RouteParamEnum.username, required: false })
  @ApiQuery({ name: RouteParamEnum.email, required: false })
  @Get('search')
  search(
    @Query(RouteParamEnum.username) username?: string,
    @Query(RouteParamEnum.email) email?: string
  ): Promise<User[]> {
    return this.userService.search(username, email);
  }

  @Get(`:${RouteParamEnum.idUser}/user-showcase`)
  findUserShowcase(
    @Param(RouteParamEnum.idUser) idUser: number
  ): Promise<UserShowcase> {
    return this.userShowcaseService.findByIdUser(idUser);
  }

  @Get(`:${RouteParamEnum.idUser}`)
  findById(@Param(RouteParamEnum.idUser) idUser: number): Promise<User> {
    return this.userService.findById(idUser);
  }
}
