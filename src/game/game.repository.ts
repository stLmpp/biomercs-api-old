import { EntityRepository } from 'typeorm';
import { Game } from './game.entity';
import { CustomRepository } from '../shared/types/custom-repository';

@EntityRepository(Game)
export class GameRepository extends CustomRepository<Game> {}
