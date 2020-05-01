import { Body, Controller, Param, Post, UploadedFile } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ScorePlayerProofService } from './score-player-proof.service';
import { ScorePlayerProof } from './score-player-proof.entity';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { getImagesAllowed } from '../../util/env';
import { CreatedByPipe } from '../../shared/pipes/created-by.pipe';
import { ScorePlayerProofAddDto } from './dto/add.dto';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';
import { RouteParamId } from '../../shared/types/route-enums';

@ApiTags('Score player proof')
@Roles(RoleEnum.user)
@Auth()
@Controller('score-player-proof')
export class ScorePlayerProofController {
  constructor(private scorePlayerProofService: ScorePlayerProofService) {}

  @Post()
  add(
    @Body(CreatedByPipe) dto: ScorePlayerProofAddDto
  ): Promise<ScorePlayerProof> {
    return this.scorePlayerProofService.add(dto);
  }

  @Post(`:${RouteParamId.idScorePlayer}`)
  @UseFileUpload({
    filesAllowed: getImagesAllowed(),
  })
  uploadFile(
    @Param(RouteParamId.idScorePlayer) idScorePlayer: number,
    @UploadedFile('file') file: FileType,
    @GetUser() user: User
  ): Promise<ScorePlayerProof> {
    return this.scorePlayerProofService.uploadImage(idScorePlayer, file, user);
  }
}
