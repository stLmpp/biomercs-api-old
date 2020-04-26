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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameRepository,
      ModeRepository,
      GameModeRepository,
      CharacterRepository,
      GameModeCharacterRepository,
      StageRepository,
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
  ],
  controllers: [
    GameController,
    ModeController,
    GameModeController,
    CharacterController,
    GameModeCharacterController,
    StageController,
  ],
  exports: [
    GameService,
    ModeService,
    GameModeService,
    CharacterService,
    GameModeCharacterService,
    StageService,
  ],
})
export class GameModule {}
