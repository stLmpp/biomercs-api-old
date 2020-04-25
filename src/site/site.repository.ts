import { EntityRepository } from 'typeorm';
import { Site } from './site.entity';
import { CustomRepository } from '../shared/types/custom-repository';

@EntityRepository(Site)
export class SiteRepository extends CustomRepository<Site> {}
