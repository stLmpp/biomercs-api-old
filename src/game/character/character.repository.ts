import { EntityRepository } from 'typeorm';
import { Character } from './character.entity';
import { CustomRepository } from '../../shared/types/custom-repository';

@EntityRepository(Character)
export class CharacterRepository extends CustomRepository<Character> {}
