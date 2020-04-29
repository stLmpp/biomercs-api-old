import { Injectable } from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeAddDto } from './dto/add.dto';
import { UpdateResult } from '../../util/types';
import { TypeUpdateDto } from './dto/update.dto';
import { Type } from './type.entity';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(TypeRepository) private typeRepository: TypeRepository
  ) {}

  async add(dto: TypeAddDto): Promise<Type> {
    return await this.typeRepository.save(new Type().extendDto(dto));
  }

  async update(idType: number, dto: TypeUpdateDto): Promise<UpdateResult> {
    return await this.typeRepository.update(idType, dto);
  }

  async exists(idType: number): Promise<boolean> {
    return await this.typeRepository.exists({ id: idType });
  }
}
