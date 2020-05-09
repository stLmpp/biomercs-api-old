import { BadRequestException, Injectable } from '@nestjs/common';
import { ScorePlayerProofRepository } from './score-player-proof.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ScorePlayerProof } from './score-player-proof.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { User } from '../../auth/user/user.entity';
import { ScorePlayerService } from '../score-player/score-player.service';
import { ScorePlayerProofAddDto } from './score-player-proof.dto';
import { SuperService } from '../../shared/super/super-service';

@Injectable()
export class ScorePlayerProofService extends SuperService<
  ScorePlayerProof,
  ScorePlayerProofAddDto
> {
  constructor(
    @InjectRepository(ScorePlayerProofRepository)
    private scorePlayerProofRepository: ScorePlayerProofRepository,
    private fileUploadService: FileUploadService,
    private scorePlayerService: ScorePlayerService
  ) {
    super(ScorePlayerProof, scorePlayerProofRepository);
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
