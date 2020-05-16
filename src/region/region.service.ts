import { Injectable } from '@nestjs/common';
import { SuperService } from '../shared/super/super-service';
import { Region } from './region.entity';
import { RegionAddDto, RegionUpdateDto } from './region.dto';
import { RegionRepository } from './region.repository';

@Injectable()
export class RegionService extends SuperService<
  Region,
  RegionAddDto,
  RegionUpdateDto
> {
  constructor(private regionRepository: RegionRepository) {
    super(Region, regionRepository);
    this.setRegions().then();
  }

  async setRegions(): Promise<void> {
    const regions = await this.regionRepository.find();
    if (!regions?.length) {
      const regionsJson = (await import('./regions.json')) as RegionAddDto[];
      await this.addMany(regionsJson);
    }
  }
}
