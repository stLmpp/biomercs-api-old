import { Score } from './score.entity';
import { Stage } from '../game/stage/stage.entity';
import { Character } from '../game/character/character.entity';
import { User } from '../auth/user/user.entity';

export class ScoreTable {
  stage: Stage;
  character?: Character;
  player?: User;
  score: Score;
  isWr?: boolean;
  wr?: Score;
}
