import { Score } from './score.entity';
import { Stage } from '../game/stage/stage.entity';
import { Character } from '../game/character/character.entity';
import { User } from '../auth/user/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ScoreTable {
  stage: Stage;
  character?: Character;
  player?: User;
  score: ScoreViewModel;
}

export class ScoreViewModel extends Score {
  isWorldRecord?: boolean;
  worldRecord?: Score;
  isCharacterWorldRecords?: boolean;
  @ApiPropertyOptional({
    name: 'isCharacterWorldRecord',
    description: 'Dictionary = { [idCharacter]: boolean }',
  })
  isCharacterWorldRecord?: { [idCharacter: number]: boolean };
  characterWorldRecords?: Score[];
  isCombinationWorldRecord?: boolean;
  combinationWorldRecord?: Score;
}

export class ScoreIsWrViewModel {
  isWorldRecord?: boolean;
  worldRecord?: Score;
  isCharacterWorldRecords?: boolean;
  @ApiPropertyOptional({
    name: 'isCharacterWorldRecord',
    description: 'Dictionary = { [idCharacter]: boolean }',
  })
  isCharacterWorldRecord?: { [idCharacter: number]: boolean };
  characterWorldRecords?: Score[];
  isCombinationWorldRecord?: boolean;
  combinationWorldRecord?: Score;
}
