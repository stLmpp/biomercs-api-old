import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { PlayerFollowerController } from './player-follower/player-follower.controller';
import { PlayerFollowerService } from './player-follower/player-follower.service';
import { PlayerFollowerRepository } from './player-follower/player-follower.repository';
import { PlayerLinkRepository } from './player-link/player-link.repository';
import { PlayerLinkController } from './player-link/player-link.controller';
import { PlayerLinkService } from './player-link/player-link.service';
import { PlayerShowcaseService } from './player-showcase/player-showcase.service';
import { PlayerShowcaseRepository } from './player-showcase/player-showcase.repository';
import { PlayerShowcaseController } from './player-showcase/player-showcase.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerRepository,
      PlayerFollowerRepository,
      PlayerLinkRepository,
      PlayerShowcaseRepository,
    ]),
    FileUploadModule,
  ],
  controllers: [
    PlayerController,
    PlayerFollowerController,
    PlayerLinkController,
    PlayerShowcaseController,
  ],
  providers: [
    PlayerService,
    PlayerShowcaseService,
    PlayerFollowerService,
    PlayerLinkService,
  ],
  exports: [PlayerService, PlayerShowcaseService],
})
export class PlayerModule {}
