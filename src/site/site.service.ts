import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteRepository } from './site.repository';
import { Site } from './site.entity';
import { SuperService } from '../shared/super/super-service';
import { SiteAddDto, SiteUpdateDto } from './site.dto';

@Injectable()
export class SiteService extends SuperService<Site, SiteAddDto, SiteUpdateDto> {
  constructor(
    @InjectRepository(SiteRepository) private siteRepository: SiteRepository
  ) {
    super(Site, siteRepository);
  }
}
