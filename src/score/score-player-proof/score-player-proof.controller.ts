import { Controller, Param, Patch, Post, UploadedFile } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ScorePlayerProofService } from './score-player-proof.service';
import { ScorePlayerProof } from './score-player-proof.entity';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { environment } from '../../shared/env/env';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { SuperController } from '../../shared/super/super-controller';
import {
  ScorePlayerProofAddDto,
  ScorePlayerProofUpdateDto,
} from './score-player-proof.dto';

@ApiTags('Score player proof')
@Roles(RoleEnum.user)
@Auth()
@Controller('score-player-proof')
export class ScorePlayerProofController extends SuperController<
  ScorePlayerProof
>({
  entity: ScorePlayerProof,
  dto: {
    add: ScorePlayerProofAddDto,
    update: ScorePlayerProofUpdateDto,
  },
  idKey: RouteParamEnum.idScorePlayerProof,
  excludeMethods: ['findAll'],
}) {
  constructor(private scorePlayerProofService: ScorePlayerProofService) {
    super(scorePlayerProofService);
  }

  @Post(`image/:${RouteParamEnum.idScorePlayer}`)
  @UseFileUpload({
    filesAllowed: environment.imageExtensionsAllowed,
  })
  uploadFile(
    @Param(RouteParamEnum.idScorePlayer) idScorePlayer: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<ScorePlayerProof> {
    return this.scorePlayerProofService.uploadImage(idScorePlayer, file, user);
  }

  @Patch(`:${RouteParamEnum.idScorePlayerProof}/image`)
  @UseFileUpload({
    filesAllowed: environment.imageExtensionsAllowed,
  })
  updateFile(
    @Param(RouteParamEnum.idScorePlayerProof) idScorePlayerProof: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<ScorePlayerProof> {
    return this.scorePlayerProofService.updateFile(
      idScorePlayerProof,
      file,
      user
    );
  }
}
