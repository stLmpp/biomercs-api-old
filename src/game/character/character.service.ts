import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterAddDto } from './dto/add.dto';
import { Character } from './character.entity';
import { CharacterUpdateDto } from './dto/update.dto';
import { UpdateResult } from '../../util/types';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { FileType } from '../../file-upload/file-type.interface';
import { updateLastUpdatedBy } from '../../shared/pipes/updated-by.pipe';
import { User } from '../../auth/user/user.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterRepository)
    private characterRepository: CharacterRepository,
    private fileUploadService: FileUploadService
  ) {}

  async add(dto: CharacterAddDto): Promise<Character> {
    return await this.characterRepository.save(new Character().extendDto(dto));
  }

  async update(
    idCharacter: number,
    dto: CharacterUpdateDto
  ): Promise<UpdateResult> {
    return await this.characterRepository.update(idCharacter, { ...dto });
  }

  async uploadImage(
    idCharacter: number,
    file: FileType,
    user: User
  ): Promise<Character> {
    const character = await this.characterRepository.findOneOrFail(idCharacter);
    if (character.idImage) {
      await this.fileUploadService.replaceFile(character.idImage, file, user);
      return character;
    } else {
      const fileUpload = await this.fileUploadService.addByFile(file);
      const update: CharacterUpdateDto = updateLastUpdatedBy(
        { idImage: fileUpload.id },
        user
      );
      await this.update(idCharacter, update);
      return character.extendDto(update);
    }
  }

  async exists(idCharacter: number): Promise<boolean> {
    return await this.characterRepository.exists({ id: idCharacter });
  }

  async findByParam(
    idGameMode?: number,
    idGame?: number,
    idMode?: number
  ): Promise<Character[]> {
    return this.characterRepository.findByParam(idGameMode, idGame, idMode);
  }
}
