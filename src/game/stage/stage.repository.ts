import { EntityRepository, Repository } from 'typeorm';
import { Stage } from './stage.entity';
import { StageParamsDto } from './stage.dto';

@EntityRepository(Stage)
export class StageRepository extends Repository<Stage> {
  async findByParams({
    idGame,
    idMode,
    ...dto
  }: StageParamsDto): Promise<Stage[]> {
    const qb = this.createQueryBuilder('stage');
    if (idGame || idMode) {
      qb.innerJoin('stage.gameModeStages', 'gms').innerJoin(
        'gms.gameMode',
        'gm'
      );
      if (idGame) {
        qb.andWhere('gm.idGame = :idGame', { idGame });
      }
      if (idMode) {
        qb.andWhere('gm.idMode = :idMode', { idMode });
      }
    }
    return this.fillAndWhere('stage', dto, qb).getMany();
  }
}
