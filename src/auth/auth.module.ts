import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../shared/env/env';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user/user.controller';
import { UserLinkRepository } from './user/user-link/user-link.repository';
import { UserLinkService } from './user/user-link/user-link.service';
import { UserLinkController } from './user/user-link/user-link.controller';
import { RoleRepository } from './role/role.repository';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { UserRoleRepository } from './user/user-role/user-role.repository';
import { UserRoleService } from './user/user-role/user-role.service';
import { UserRoleController } from './user/user-role/user-role.controller';
import { RequestService } from './user/request.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserFriendService } from './user/user-friend/user-friend.service';
import { UserFriendController } from './user/user-friend/user-friend.controller';
import { UserFriendRepository } from './user/user-friend/user-friend.repository';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environment.get('JWT_SECRET'),
      signOptions: {
        expiresIn: environment.get('JWT_EXPIRES_IN'),
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserLinkRepository,
      RoleRepository,
      UserRoleRepository,
      UserFriendRepository,
    ]),
    FileUploadModule,
  ],
  providers: [
    AuthService,
    RequestService,
    UserService,
    JwtStrategy,
    UserLinkService,
    RoleService,
    UserRoleService,
    UserFriendService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    UserService,
    RoleService,
    RequestService,
    UserRoleService,
    UserFriendService,
  ],
  controllers: [
    AuthController,
    UserController,
    UserLinkController,
    RoleController,
    UserRoleController,
    UserFriendController,
  ],
})
export class AuthModule {}
