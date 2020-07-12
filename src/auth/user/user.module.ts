import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRoleController } from './user-role/user-role.controller';
import { UserFollowerController } from './user-follower/user-follower.controller';
import { UserShowcaseController } from './user-showcase/user-showcase.controller';
import { UserLinkController } from './user-link/user-link.controller';
import { UserService } from './user.service';
import { UserRoleService } from './user-role/user-role.service';
import { UserFollowerService } from './user-follower/user-follower.service';
import { UserShowcaseService } from './user-showcase/user-showcase.service';
import { UserLinkService } from './user-link/user-link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from './user-role/user-role.repository';
import { UserFollowerRepository } from './user-follower/user-follower.repository';
import { UserShowcaseRepository } from './user-showcase/user-showcase.repository';
import { UserLinkRepository } from './user-link/user-link.repository';
import { FileUploadModule } from '../../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserRoleRepository,
      UserFollowerRepository,
      UserShowcaseRepository,
      UserLinkRepository,
    ]),
    FileUploadModule,
  ],
  controllers: [
    UserController,
    UserRoleController,
    UserFollowerController,
    UserShowcaseController,
    UserLinkController,
  ],
  providers: [
    UserService,
    UserRoleService,
    UserFollowerService,
    UserShowcaseService,
    UserLinkService,
  ],
  exports: [
    UserService,
    UserRoleService,
    UserFollowerService,
    UserShowcaseService,
    UserLinkService,
  ],
})
export class UserModule {}
