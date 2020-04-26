import { EntityRepository } from 'typeorm';
import { Mode } from './mode.entity';
import { CustomRepository } from '../../shared/types/custom-repository';

@EntityRepository(Mode)
export class ModeRepository extends CustomRepository<Mode> {}
