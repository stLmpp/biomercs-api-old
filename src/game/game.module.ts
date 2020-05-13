import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { ModeRepository } from './mode/mode.repository';
import { ModeService } from './mode/mode.service';
import { ModeController } from './mode/mode.controller';
import { GameModeController } from './game-mode/game-mode.controller';
import { GameModeService } from './game-mode/game-mode.service';
import { GameModeRepository } from './game-mode/game-mode.repository';
import { CharacterService } from './character/character.service';
import { CharacterController } from './character/character.controller';
import { CharacterRepository } from './character/character.repository';
import { GameModeCharacterService } from './game-mode-character/game-mode-character.service';
import { GameModeCharacterController } from './game-mode-character/game-mode-character.controller';
import { GameModeCharacterRepository } from './game-mode-character/game-mode-character.repository';
import { StageController } from './stage/stage.controller';
import { StageService } from './stage/stage.service';
import { StageRepository } from './stage/stage.repository';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { TypeController } from './type/type.controller';
import { TypeService } from './type/type.service';
import { TypeRepository } from './type/type.repository';
import { PlatformController } from './platform/platform.controller';
import { PlatformService } from './platform/platform.service';
import { PlatformRepository } from './platform/platform.repository';
import { GameModePlatformController } from './game-mode-platform/game-mode-platform.controller';
import { GameModePlatformService } from './game-mode-platform/game-mode-platform.service';
import { GameModePlatformRepository } from './game-mode-platform/game-mode-platform.repository';
import { GameModeTypeController } from './game-mode-type/game-mode-type.controller';
import { GameModeTypeService } from './game-mode-type/game-mode-type.service';
import { GameModeTypeRepository } from './game-mode-type/game-mode-type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameRepository,
      ModeRepository,
      GameModeRepository,
      CharacterRepository,
      GameModeCharacterRepository,
      StageRepository,
      TypeRepository,
      PlatformRepository,
      GameModePlatformRepository,
      GameModeTypeRepository,
    ]),
    FileUploadModule,
  ],
  providers: [
    GameService,
    ModeService,
    GameModeService,
    CharacterService,
    GameModeCharacterService,
    StageService,
    TypeService,
    PlatformService,
    GameModePlatformService,
    GameModeTypeService,
  ],
  controllers: [
    GameController,
    ModeController,
    GameModeController,
    CharacterController,
    GameModeCharacterController,
    StageController,
    TypeController,
    PlatformController,
    GameModePlatformController,
    GameModeTypeController,
  ],
  exports: [
    GameService,
    ModeService,
    GameModeService,
    CharacterService,
    GameModeCharacterService,
    StageService,
    TypeService,
    PlatformService,
    GameModePlatformService,
    GameModeTypeService,
  ],
})
export class GameModule {}
