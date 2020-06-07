import { Injectable } from '@nestjs/common';
import { SuperService } from '../../shared/super/super-service';
import { Reason } from './reason.entity';
import { ReasonAddDto, ReasonUpdateDto } from './reason.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReasonRepository } from './reason.repository';

@Injectable()
export class ReasonService extends SuperService<
  Reason,
  ReasonAddDto,
  ReasonUpdateDto
> {
  constructor(
    @InjectRepository(ReasonRepository)
    private reasonRepository: ReasonRepository
  ) {
    super(Reason, reasonRepository);
  }
}
