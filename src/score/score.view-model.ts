import { Score } from './score.entity';
import { Stage } from '../game/stage/stage.entity';
import { Character } from '../game/character/character.entity';

export class ScoreTable {
  stage: Stage;
  character?: Character;
  score: Score;
}
