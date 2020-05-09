import { Injectable } from '@nestjs/common';
import { ModeRepository } from './mode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Mode } from './mode.entity';
import { ModeAddDto, ModeParamsDto, ModeUpdateDto } from './mode.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class ModeService extends SuperService<Mode, ModeAddDto, ModeUpdateDto> {
  constructor(
    @InjectRepository(ModeRepository) private modeRepository: ModeRepository
  ) {
    super(Mode, modeRepository);
  }

  async findByParams(where: ModeParamsDto): Promise<Mode[]> {
    return this.modeRepository.findByParams(where);
  }
}
