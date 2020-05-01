import { BadRequestException, Injectable } from '@nestjs/common';
import { ScorePlayerProofRepository } from './score-player-proof.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ScorePlayerProof } from './score-player-proof.entity';
import { ScorePlayerProofAddDto } from './dto/add.dto';
import { FileType } from '../../file-upload/file-type.interface';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { User } from '../../auth/user/user.entity';
import { ScorePlayerService } from '../score-player/score-player.service';

@Injectable()
export class ScorePlayerProofService {
  constructor(
    @InjectRepository(ScorePlayerProofRepository)
    private scorePlayerProofRepository: ScorePlayerProofRepository,
    private fileUploadService: FileUploadService,
    private scorePlayerService: ScorePlayerService
  ) {}

  async add(dto: ScorePlayerProofAddDto): Promise<ScorePlayerProof> {
    return await this.scorePlayerProofRepository.save(
      new ScorePlayerProof().extendDto(dto)
    );
  }

  async uploadImage(
    idScorePlayer: number,
    file: FileType,
    user: User
  ): Promise<ScorePlayerProof> {
    if (!(await this.scorePlayerService.exists(idScorePlayer))) {
      throw new BadRequestException(`ScorePlayer doesn't exist`);
    }
    const newFile = await this.fileUploadService.addByFile(file, user);
    return await this.scorePlayerProofRepository.save(
      new ScorePlayerProof().extendDto({ idScorePlayer, idImage: newFile.id })
    );
  }
}
