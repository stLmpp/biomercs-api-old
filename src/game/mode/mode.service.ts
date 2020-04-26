import { Injectable } from '@nestjs/common';
import { ModeRepository } from './mode.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ModeAddDto } from './dto/add.dto';
import { Mode } from './mode.entity';
import { ModeUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';

@Injectable()
export class ModeService {
  constructor(
    @InjectRepository(ModeRepository) private modeRepository: ModeRepository
  ) {}

  async add(dto: ModeAddDto): Promise<Mode> {
    return await this.modeRepository.save(new Mode().extendDto(dto));
  }

  async update(idMode: number, dto: ModeUpdateDto): Promise<UpdateResult> {
    return await this.modeRepository.update(idMode, dto);
  }

  async exists(idMode: number): Promise<boolean> {
    return await this.modeRepository.exists({ id: idMode });
  }
}
