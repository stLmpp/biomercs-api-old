import { Injectable } from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './type.entity';
import { TypeAddDto, TypeUpdateDto } from './type.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class TypeService extends SuperService<Type, TypeAddDto, TypeUpdateDto> {
  constructor(
    @InjectRepository(TypeRepository) private typeRepository: TypeRepository
  ) {
    super(Type, typeRepository);
  }
}
