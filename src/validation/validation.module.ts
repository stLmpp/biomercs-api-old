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

@Global()
@Module({
  imports: [SiteModule, GameModule, FileUploadModule],
  providers: [
    UserExistsValidator,
    IdReferenceExistsValidator,
    SiteExistsValidator,
    GameExistsValidator,
    ModeExistsValidator,
    GameModeExistsValidator,
    FileUploadExistsValidator,
  ],
})
export class ValidationModule {}
