import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { GameModule } from '../game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import { ScorePlayerController } from './score-player/score-player.controller';
import { ScorePlayerService } from './score-player/score-player.service';
import { ScorePlayerRepository } from './score-player/score-player.repository';
import { ScorePlayerProofController } from './score-player-proof/score-player-proof.controller';
import { ScorePlayerProofService } from './score-player-proof/score-player-proof.service';
import { ScorePlayerProofRepository } from './score-player-proof/score-player-proof.repository';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ScoreApprovalController } from './score-approval/score-approval.controller';
import { ScoreApprovalService } from './score-approval/score-approval.service';
import { ScoreApprovalRepository } from './score-approval/score-approval.repository';
import { ScoreStatusRepository } from './score-status/score-status.repository';
import { ScoreStatusController } from './score-status/score-status.controller';
import { ScoreStatusService } from './score-status/score-status.service';
import { UserModule } from '../auth/user/user.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScoreRepository,
      ScorePlayerRepository,
      ScorePlayerProofRepository,
      ScoreApprovalRepository,
      ScoreStatusRepository,
    ]),
    GameModule,
    FileUploadModule,
    UserModule,
    PlayerModule,
  ],
  controllers: [
    ScoreController,
    ScorePlayerController,
    ScorePlayerProofController,
    ScoreApprovalController,
    ScoreStatusController,
  ],
  providers: [
    ScoreService,
    ScorePlayerService,
    ScorePlayerProofService,
    ScoreApprovalService,
    ScoreStatusService,
  ],
  exports: [
    ScoreService,
    ScorePlayerService,
    ScorePlayerProofService,
    ScoreApprovalService,
    ScoreStatusService,
  ],
})
export class ScoreModule {}
