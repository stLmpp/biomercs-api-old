import { Global, Module } from '@nestjs/common';
import { UserExistsValidator } from './user/user-exists.validator';
import { IdReferenceExistsValidator } from './like/id-reference-exists.validator';
import { SiteExistsValidator } from './site/site.validator';
import { SiteModule } from '../site/site.module';
import { GameExistsValidator } from './game/game-exists.validator';
import { GameModule } from '../game/game.module';
import { ModeExistsValidator } from './game/mode-exists.validator';
import { GameModeExistsValidator } from './game/game-mode-exists.validator';
import { FileUploadExistsValidator } from './file-upload/file-upload-exists.validator';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ScoreModule } from '../score/score.module';
import { ScorePlayerExistsValidator } from './score/score-player-exists.validator';
import { PlatformExistsValidator } from './game/platform-exists.validator';
import { ScoreExistsValidator } from './score/score-exists.validator';
import { TypeExistsValidator } from './game/type-exists.validator';
import { RegionExistsValidator } from './region/region-exists.validator';
import { RegionModule } from '../region/region.module';
import { StageExistsValidator } from './score/stage-exists-validator';
import { ReasonExistsValidator } from './report/reason-exists.validator';
import { ReportModule } from '../report/report.module';
import { UserModule } from '../auth/user/user.module';
import { PlayerModule } from '../player/player.module';

@Global()
@Module({
  imports: [
    SiteModule,
    GameModule,
    FileUploadModule,
    ScoreModule,
    RegionModule,
    ReportModule,
    UserModule,
    PlayerModule,
  ],
  providers: [
    UserExistsValidator,
    IdReferenceExistsValidator,
    SiteExistsValidator,
    GameExistsValidator,
    ModeExistsValidator,
    GameModeExistsValidator,
    FileUploadExistsValidator,
    ScorePlayerExistsValidator,
    PlatformExistsValidator,
    ScoreExistsValidator,
    TypeExistsValidator,
    RegionExistsValidator,
    StageExistsValidator,
    ReasonExistsValidator,
  ],
})
export class ValidationModule {}
