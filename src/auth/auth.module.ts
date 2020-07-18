import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../shared/env/env';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RoleRepository } from './role/role.repository';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { RequestService } from './user/request.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserModule } from './user/user.module';
import { PlayerModule } from '../player/player.module';

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
    TypeOrmModule.forFeature([RoleRepository]),
    FileUploadModule,
    UserModule,
    PlayerModule,
  ],
  providers: [AuthService, RequestService, JwtStrategy, RoleService],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    RoleService,
    RequestService,
  ],
  controllers: [AuthController, RoleController],
})
export class AuthModule {}
