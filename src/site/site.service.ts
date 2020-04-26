import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteRepository } from './site.repository';
import { Site } from './site.entity';
import { LikeLowercase } from '../util/query-operators';
import { SiteAddDto } from './dto/add.dto';
import { SiteUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../util/types';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteRepository) private siteRepository: SiteRepository
  ) {}

  async search(term: string): Promise<Site[]> {
    return await this.siteRepository.find({
      where: [
        {
          name: LikeLowercase(`%${term}%`),
        },
        {
          url: LikeLowercase(`%${term}%`),
        },
      ],
    });
  }

  async add(dto: SiteAddDto): Promise<Site> {
    return await this.siteRepository.save(dto);
  }

  async addMany(dto: SiteAddDto[]): Promise<Site[]> {
    return await this.siteRepository.save(dto);
  }

  async update(idSite: number, dto: SiteUpdateDto): Promise<UpdateResult> {
    return await this.siteRepository.update(idSite, dto);
  }

  async exists(idSite: number): Promise<boolean> {
    return await this.siteRepository.exists({ id: idSite });
  }
}
