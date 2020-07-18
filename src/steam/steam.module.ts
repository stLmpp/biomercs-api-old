import { HttpModule, Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamProfileRepository } from './steam-profile.repository';
import { UserModule } from '../auth/user/user.module';
import { PlayerModule } from '../player/player.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SteamProfileRepository]),
    HttpModule,
    UserModule,
    PlayerModule,
    ScoreModule,
  ],
  controllers: [SteamController],
  providers: [SteamService],
})
export class SteamModule {}
