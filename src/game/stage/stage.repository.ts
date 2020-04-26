import { EntityRepository } from 'typeorm';
import { Stage } from './stage.entity';
import { CustomRepository } from '../../shared/types/custom-repository';

@EntityRepository(Stage)
export class StageRepository extends CustomRepository<Stage> {}
