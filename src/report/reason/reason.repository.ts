import { EntityRepository, Repository } from 'typeorm';
import { Reason } from './reason.entity';

@EntityRepository(Reason)
export class ReasonRepository extends Repository<Reason> {}
