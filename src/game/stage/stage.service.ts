import { Injectable } from '@nestjs/common';
import { StageRepository } from './stage.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { StageAddDto } from './dto/add.dto';
import { Stage } from './stage.entity';
import { StageUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(StageRepository) private stageRepository: StageRepository
  ) {}

  async add(dto: StageAddDto): Promise<Stage> {
    return await this.stageRepository.save(new Stage().extendDto(dto));
  }

  async update(idStage: number, dto: StageUpdateDto): Promise<UpdateResult> {
    return await this.stageRepository.update(idStage, dto);
  }

  async exists(idStage: number): Promise<boolean> {
    return await this.stageRepository.exists({ id: idStage });
  }
}
