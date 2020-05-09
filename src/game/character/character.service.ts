import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { SuperService } from '../../shared/super/super-service';
import {
  CharacterAddDto,
  CharacterParamsDto,
  CharacterUpdateDto,
} from './character.dto';

@Injectable()
export class CharacterService extends SuperService<
  Character,
  CharacterAddDto,
  CharacterUpdateDto
> {
  constructor(
    @InjectRepository(CharacterRepository)
    private characterRepository: CharacterRepository,
    private fileUploadService: FileUploadService
  ) {
    super(Character, characterRepository, fileUploadService, {
      idFileKey: 'idImage',
    });
  }

  async findByParams(where: CharacterParamsDto): Promise<Character[]> {
    return this.characterRepository.findByParams(where);
  }
}
