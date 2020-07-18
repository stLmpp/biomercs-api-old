import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRoleController } from './user-role/user-role.controller';
import { UserService } from './user.service';
import { UserRoleService } from './user-role/user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from './user-role/user-role.repository';
import { FileUploadModule } from '../../file-upload/file-upload.module';
import { PlayerModule } from '../../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserRoleRepository]),
    FileUploadModule,
    PlayerModule,
  ],
  controllers: [UserController, UserRoleController],
  providers: [UserService, UserRoleService],
  exports: [UserService, UserRoleService, TypeOrmModule],
})
export class UserModule {}
